<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Program;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function store(Request $request, Program $program)
    {
        $request->validate([
            'content' => 'required|string',
        ]);

        $comment = $program->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $request->content,
        ]);

        return response()->json($comment->load('user:id,name'), 201);
    }

    public function update(Request $request, Comment $comment)
    {
        // Check authorization
        $this->authorize('update', $comment);

        $request->validate([
            'content' => 'required|string',
        ]);

        $comment->content = $request->content;
        $comment->save();

        return response()->json($comment);
    }

    public function destroy(Comment $comment)
    {
        // Check authorization
        $this->authorize('delete', $comment);

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully']);
    }
}