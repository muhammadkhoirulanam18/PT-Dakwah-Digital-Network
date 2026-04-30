<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Models\User;

Route::get('/health', fn() => ['status'=>'ok']);

Route::get('/test', fn() => ['status'=>'ok']);

Route::post('/register', function (Request $r) {
  $v = $r->validate([
    'name'=>'required|string|max:255',
    'email'=>'required|email|max:255|unique:users',
    'password'=>'required|string|min:6'
  ]);

  $u = User::create([
    'name'=>$v['name'],
    'email'=>$v['email'],
    'password'=>Hash::make($v['password'])
  ]);

  return response()->json(['message'=>'registered','user'=>$u],201);
});

Route::post('/login', function (Request $r) {
  if (!Auth::attempt($r->only('email','password')))
    return response()->json(['message'=>'invalid'],401);

  $u = Auth::user();
  $t = $u->createToken('api')->plainTextToken;

  return ['token'=>$t,'user'=>$u];
});

Route::middleware('auth:sanctum')->get('/me', fn(Request $r) => $r->user());
