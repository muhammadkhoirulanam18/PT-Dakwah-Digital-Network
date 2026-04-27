<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SalesPage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;

class GeneratorController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $salesPages = SalesPage::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'data' => $salesPages,
        ]);
    }

    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_name' => 'required|string|max:255',
            'description'  => 'required|string',
            'audience'     => 'nullable|string',
            'price'        => 'nullable|numeric',
            'usp'          => 'nullable|string',
        ]);

        $prompt = "Generate a high-converting sales page content for the following product:
        Product Name: {$validated['product_name']}
        Description: {$validated['description']}
        Audience: " . ($validated['audience'] ?? 'General') . "
        Price: " . ($validated['price'] ?? 'Contact us') . "
        USP: " . ($validated['usp'] ?? 'Not specified') . "

        Return the response in JSON format with the following keys:
        - headline
        - subheadline
        - benefits (array)
        - features (array)
        - testimonial
        - pricing
        - cta";

        $result = OpenAI::chat()->create([
            'model' => 'gpt-3.5-turbo-0125',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a professional copywriter. Respond ONLY with JSON.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'response_format' => ['type' => 'json_object'],
        ]);

        $generatedContent = json_decode($result->choices[0]->message->content, true);

        $salesPage = SalesPage::create([
            'user_id'           => $request->user()->id,
            'product_name'      => $validated['product_name'],
            'description'       => $validated['description'],
            'audience'          => $validated['audience'],
            'price'             => $validated['price'],
            'usp'               => $validated['usp'],
            'generated_content' => $generatedContent,
        ]);

        return response()->json([
            'message' => 'Sales page content generated successfully.',
            'data'    => $salesPage,
        ]);
    }

    public function show(Request $request, $id): JsonResponse
    {
        $salesPage = SalesPage::where('user_id', $request->user()->id)->findOrFail($id);

        return response()->json([
            'data' => $salesPage,
        ]);
    }

    public function regenerate(Request $request, $id): JsonResponse
    {
        $salesPage = SalesPage::where('user_id', $request->user()->id)->findOrFail($id);

        $prompt = "Generate a high-converting sales page content for the following product:
        Product Name: {$salesPage->product_name}
        Description: {$salesPage->description}
        Audience: " . ($salesPage->audience ?? 'General') . "
        Price: " . ($salesPage->price ?? 'Contact us') . "
        USP: " . ($salesPage->usp ?? 'Not specified') . "

        Return the response in JSON format with the following keys:
        - headline
        - subheadline
        - benefits (array)
        - features (array)
        - testimonial
        - pricing
        - cta";

        $result = OpenAI::chat()->create([
            'model' => 'gpt-3.5-turbo-0125',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a professional copywriter. Respond ONLY with JSON.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'response_format' => ['type' => 'json_object'],
        ]);

        $generatedContent = json_decode($result->choices[0]->message->content, true);

        $salesPage->update([
            'generated_content' => $generatedContent,
        ]);

        return response()->json([
            'message' => 'Sales page content regenerated successfully.',
            'data'    => $salesPage,
        ]);
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        $salesPage = SalesPage::where('user_id', $request->user()->id)->findOrFail($id);
        
        $salesPage->delete();

        return response()->json([
            'message' => 'Sales page deleted successfully.',
        ]);
    }
}
