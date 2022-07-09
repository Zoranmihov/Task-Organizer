<?php

namespace App\Http\Controllers;

use App\Events\ProjectEvent;
use App\Models\Project;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class ProjectController extends Controller
{
    public function createProject(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' =>   'required|max:191',
            'description' =>  'required|max:2000',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => "Invalid data"
            ], 400);
        } else {
            Project::create([
                'title' => $request->title,
                'description' => $request->description,
                'members' => [[
                    'name' => Auth::user()->name,
                    'email' => Auth::user()->email,
                ]],
                'created_by' => Auth::user()->email,
                'tasks' => []
            ]);
            return response()->json([
                'message' => "Success"
            ], 200);
        }
    }

    public function deleteProject(Request $request)
    {
        $project = Project::whereJsonContains('members', ['email' => Auth::user()->email])->where('id', $request->id)->first();
        if (!$project) {
            return response()->json([
                'message' => 'Bad request'
            ], 400);
        } else {
            if ($project->created_by != Auth::user()->email) {
                return response()->json([
                    'message' => 'Only the creator of the project can delete the project'
                ], 400);
            }
            $project->delete();
            return response($status = 200);
        }
    }

    public function getProjects(Request $request)
    {
        $projects = Project::whereJsonContains('members', ['email' => Auth::user()->email])->get();
        if (count($projects) > 0) {
            return response()->json([
                'projects' => $projects
            ], 200);
        } else {
            return response()->json([
                'message' => "Nothing found"
            ], 400);
        }
    }

    public function getSingleProject(Request $request)
    {
        $project = Project::whereJsonContains('members', ['email' => Auth::user()->email])->where('id', $request->id)->first();
        if (!$project) {
            return response()->json([
                'message' => 'Bad request'
            ], 400);
        } else {
            event(new ProjectEvent($project));
            return response()->json([
                'message' => 'Connection established'
            ], 200);
        }
    }

    public function leaveProject(Request $request)
    {
        $project = Project::whereJsonContains('members', ['email' => Auth::user()->email])->where('id', $request->id)->first();
        if (!$project) {
            return response()->json([
                'message' => 'Bad request'
            ], 400);
        } else {
            if ($project->created_by == Auth::user()->email) {
                return response()->json([
                    'message' => 'You cant leave projects you created'
                ], 400);
            }
            $members = $project->members;
            $found_key = array_search(Auth::user()->email, array_column($members, 'email'));
            array_splice($members, $found_key, 1);
            $project->members = $members;
            $project->save();
            event(new ProjectEvent($project));
            return response($status = 200);
        }
    }

    public function createTask(Request $request)
    {
        $project = Project::whereJsonContains('members', ['email' => Auth::user()->email])->where('id', $request->id)->first();
        if (!$project) {
            return response()->json([
                'message' => 'Bad request'
            ], 400);
        } else {
            $tasks = $project->tasks;
            $tasks[] = [
                "id" => time() . '-' . Auth::user()->name,
                "description" => $request->task,
                "stage" => "To do",
                "created_by" => Auth::user()->name,
                'created_at' => Carbon::now()
            ];
            $project->tasks = $tasks;
            $project->save();
            event(new ProjectEvent($project));
            return response()->json([
                'message' => 'Worked'
            ], 200);
        }
    }

    public function updateTask(Request $request)
    {
        $project = Project::whereJsonContains('members', ['email' => Auth::user()->email])->where('id', $request->id)->first();
        if (!$project) {
            return response()->json([
                'message' => 'Bad request'
            ], 400);
        } else {
            $tasks = $project->tasks;
            $found_key = array_search($request->task['id'], array_column($tasks, 'id'));
            $tasks[$found_key] = $request->task;
            $project->tasks = $tasks;
            $project->save();
            event(new ProjectEvent($project));
            return response($status = 200);
        }
    }

    public function deleteTask(Request $request)
    {
        $project = Project::whereJsonContains('members', ['email' => Auth::user()->email])->where('id', $request->projectId)->first();
        if (!$project) {
            return response()->json([
                'message' => 'Bad request'
            ], 400);
        } else {
            $tasks = $project->tasks;
            $found_key = array_search($request->taskId, array_column($tasks, 'id'));
            array_splice($tasks, $found_key, 1);
            $project->tasks = $tasks;
            $project->save();
            event(new ProjectEvent($project));
            return response($status = 200);
        }
    }

    public function message(Request $request)
    {
        Log::debug($request);
        $project = Project::whereJsonContains('members', ['email' => Auth::user()->email])->where('id', $request->id)->first();
        if (!$project) {
            return response()->json([
                'message' => 'Bad request'
            ], 400);
        } else {
            $messages = $project->chat;
            $messages[] = [
                'name' => Auth::user()->name,
                'message' => $request->message,
                'time' => Carbon::now()
            ];
            $project->chat = $messages;
            $project->save();
            event(new ProjectEvent($project));
            return response($status = 200);
        }
    }

    public function addMemeber(Request $request)
    {
        $project = Project::whereJsonContains('members', ['email' => Auth::user()->email])->where('id', $request->id)->first();
        if (!$project) {
            return response()->json([
                'message' => 'Bad request'
            ], 400);
        } else {
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                return response()->json([
                    'message' => 'User not found'
                ], 400);
            } else {
                $members = $project->members;
                if (in_array($request->email, $members)) {
                    return response()->json([
                        'message' => 'User is already a memember'
                    ], 400);
                } else {
                    $members[] = [
                        'name' => $user->name,
                        'email' => $user->email
                    ];
                    $project->members = $members;
                    $project->save();
                    event(new ProjectEvent($project));
                    return response()->json([
                        'message' => 'User added'
                    ], 200);
                }
            }
        }
    }

    public function removeMember(Request $request)
    {
        $project = Project::whereJsonContains('members', ['email' => Auth::user()->email])->where('id', $request->id)->first();
        if (!$project) {
            return response()->json([
                'message' => 'Bad request'
            ], 400);
        } else {
            if ($project->created_by != Auth::user()->email) {
                return response()->json([
                    'message' => 'Only the creator of the project can remove members'
                ], 400);
            }
            $members = $project->members;
            $found_key = array_search($request->email, array_column($members, 'email'));
            array_splice($members, $found_key, 1);
            $project->members = $members;
            $project->save();
            event(new ProjectEvent($project));
            return response($status = 200);
        }
    }
}
