<?php

namespace App\Policies;

use App\Models\Program;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProgramPolicy
{
    use HandlesAuthorization;

    public function update(User $user, Program $program)
    {
        return $user->id === $program->user_id;
    }

    public function delete(User $user, Program $program)
    {
        return $user->id === $program->user_id || $user->hasRole('admin');
    }
}