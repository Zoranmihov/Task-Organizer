<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\User;
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
            ]);
            return response()->json([
                'message' => "Success"
            ], 200);
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
            ], 200);
        }
    }
}
