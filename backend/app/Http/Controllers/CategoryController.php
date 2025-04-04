<?php
namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }

    public function index()
    {
        return response()->json(Category::all());
    }

    public function store(Request $request)
    {
        // Require admin role
        if (!$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'required|string|max:50|unique:categories',
            'description' => 'nullable|string',
        ]);

        $category = Category::create([
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'description' => $request->description,
        ]);

        return response()->json($category, 201);
    }

    public function show(Category $category)
    {
        return response()->json($category);
    }

    public function update(Request $request, Category $category)
    {
        // Require admin role
        if (!$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $request->validate([
            'name' => 'sometimes|required|string|max:50|unique:categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        if ($request->has('name')) {
            $category->name = $request->name;
            $category->slug = Str::slug($request->name);
        }
        
        if ($request->has('description')) {
            $category->description = $request->description;
        }
        
        $category->save();

        return response()->json($category);
    }

    public function destroy(Request $request, Category $category)
    {
        // Require admin role
        if (!$request->user()->hasRole('admin')) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $category->delete();
        return response()->json(['message' => 'Category deleted successfully']);
        
    }
}