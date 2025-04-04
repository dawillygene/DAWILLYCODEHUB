<?php
namespace App\Http\Controllers;

use App\Models\Program;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProgramController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show', 'download']);
    }

    public function index(Request $request)
    {
        $query = Program::with(['user:id,name', 'categories'])
            ->where('status', 'published');

        // Apply filters
        if ($request->has('category')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $search = $request->search;
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $allowedSortFields = ['created_at', 'title', 'download_count', 'view_count'];
        
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $perPage = $request->get('per_page', 10);
        return $query->paginate($perPage);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'file' => 'required|file|max:10240', // 10MB max
            'thumbnail' => 'nullable|image|max:2048', // 2MB max
            'programming_language' => 'required|string|max:50',
            'version' => 'required|string|max:20',
            'categories' => 'required|array',
            'categories.*' => 'exists:categories,id',
        ]);

        // Store the program file
        $filePath = $request->file('file')->store('programs', 'public');
        
        // Store the thumbnail if provided
        $thumbnailPath = null;
        if ($request->hasFile('thumbnail')) {
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
        }

        // Create the program
        $program = Program::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'file_path' => $filePath,
            'thumbnail_path' => $thumbnailPath,
            'programming_language' => $request->programming_language,
            'version' => $request->version,
            'status' => $request->get('status', 'published'),
        ]);

        // Attach categories
        $program->categories()->attach($request->categories);

        return response()->json($program->load(['categories', 'user:id,name']), 201);
    }

    public function show(Program $program)
    {
        // Increment view count
        $program->incrementViewCount();
        
        return response()->json($program->load(['user:id,name,email', 'categories', 'comments.user:id,name']));
    }

    public function update(Request $request, Program $program)
    {
       
        $this->authorize('update', $program);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'file' => 'nullable|file|max:10240', // 10MB max
            'thumbnail' => 'nullable|image|max:2048', // 2MB max
            'programming_language' => 'sometimes|required|string|max:50',
            'version' => 'sometimes|required|string|max:20',
            'categories' => 'sometimes|required|array',
            'categories.*' => 'exists:categories,id',
            'status' => 'sometimes|required|in:published,draft,archived',
        ]);

        // Handle file update if provided
        if ($request->hasFile('file')) {
            // Delete old file
            Storage::disk('public')->delete($program->file_path);
            // Store new file
            $filePath = $request->file('file')->store('programs', 'public');
            $program->file_path = $filePath;
        }

        // Handle thumbnail update if provided
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail if exists
            if ($program->thumbnail_path) {
                Storage::disk('public')->delete($program->thumbnail_path);
            }
            // Store new thumbnail
            $thumbnailPath = $request->file('thumbnail')->store('thumbnails', 'public');
            $program->thumbnail_path = $thumbnailPath;
        }

        // Update program details
        $program->fill($request->only([
            'title', 
            'description', 
            'programming_language', 
            'version', 
            'status'
        ]));
        
        $program->save();

        // Update categories if provided
        if ($request->has('categories')) {
            $program->categories()->sync($request->categories);
        }

        return response()->json($program->load(['categories', 'user:id,name']));
    }

    public function destroy(Program $program)
    {
        // Check authorization
        $this->authorize('delete', $program);

        // Delete files
        Storage::disk('public')->delete($program->file_path);
        if ($program->thumbnail_path) {
            Storage::disk('public')->delete($program->thumbnail_path);
        }

        // Delete program
        $program->delete();

        return response()->json(['message' => 'Program deleted successfully']);
    }

    public function download(Program $program)
    {
        // Increment download count
        $program->incrementDownloadCount();
        
        // Generate download URL or stream file
        $filePath = Storage::disk('public')->path($program->file_path);
        return response()->download($filePath, basename($program->file_path));
    }
}