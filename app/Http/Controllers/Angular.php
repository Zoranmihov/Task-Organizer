<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class Angular extends Controller
{
    public function index(){
        return view("angular");
    }
}
