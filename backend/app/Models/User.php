<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use HasApiTokens,HasFactory, Notifiable;  

   protected $table = 'users';

    protected $fillable = [
        'name', 
        'email',
        'password',
    ];



    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


    public function programs()
    {
        return $this->hasMany(Program::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

}
