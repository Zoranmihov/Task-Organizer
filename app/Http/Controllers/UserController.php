<?php

namespace App\Http\Controllers;

use App\Mail\CodeEmail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

// Helper function
function generateCode(){
    $code = "";
    $x = 0;
    while ($x < 6) {
        $code = $code . strval(mt_rand(0, 9));
        $x++;
    }
    return $code;
}

class UserController extends Controller
{
     function generateCode(){
        $code = "";
        $x = 0;
        while ($x < 6) {
            $code = $code . strval(mt_rand(0, 9));
            $x++;
        }
        return $code;
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' =>   'required|max:191',
            'email' => 'required|email|max:191|unique:users,email|',
            'password' => 'required|min:8'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'message' => "Invalid data"
            ], 400);
        } else {

            $code = generateCode();

            $data = [
                'name' => $request->name,
                'code' => $code
            ];

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'v_code' => $code
            ]);

            Mail::to($request->email)->send(new CodeEmail($data));
            $token = $user->createToken($request->email)->plainTextToken;
            return response()->json([
                'message' => 'Welcome'
            ], 200)->withCookie(cookie('Bearer', $token, 7 * 24 * 60));
        }
    }

    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials'
            ], 401);
        } else {
            $token = $user->createToken($user->email)->plainTextToken;
            return response()->json([
                'message' => 'Welcome'
            ], 200)->withCookie(cookie('Bearer', $token, 7 * 24 * 60));
        }
    }

    public function resendCode(Request $request){
       $user = User::where('email', Auth::user()->email)->first();
       $code = generateCode();
       $user->v_code = $code;
       $user->save();
       $data = [
        'name' => Auth::user()->name,
        'code' => $code
       ];
       Mail::to(Auth::user()->email)->send(new CodeEmail($data));

       return response()->json([
        "message" => 'A new code was sent to your email'
       ], 200);
    }

    public function verifyUser(Request $request)
    {
        Log::debug($request);
        $user = User::where('email', Auth::user()->email)->where("v_code", $request->code)->first();

        if (!$user) {
            return response()->json([
                'message' => 'Invalid or expired code'
            ], 401);
        } else {
            $user->verified = true;
            $user->v_code = null;
            $user->save();
            return response()->json([
                'message' => 'Your account has been activated'
            ], 200);
        }
    }
    public function profile()
    {
        if (Auth::check()) {
            return response()->json([
                'name' => Auth::user()->name,
                'verified' => Auth::user()->verified,
                'email' => Auth::user()->email,
                'online' => true
            ], 200);
        }
    }
    public function logout(Request $request)
    {
        Auth::user()->tokens->each(function ($token, $key) {
            $token->delete();
        });
        return response()->json([
            'message' => 'Hope to see you soon'
        ], 200)->withCookie(cookie('Bearer', '', 1 * 0.01));
    }

    // public function test(Request $request)
    // {
    //     $user = User::where('email', Auth::user()->email)->first();
    //     return response()->json([
    //         'message' =>  now()->diffInDays($user->created_at)
    //     ], 200);
    // }
}
