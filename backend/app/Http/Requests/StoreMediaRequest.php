<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255|unique:media,title',
            'type' => 'required|string|max:100',
            'description' => 'nullable|string',
            'cover' => 'nullable|string|max:255',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul media wajib diisi.',
            'title.string' => 'Judul media harus berupa teks.',
            'title.max' => 'Judul media maksimal 255 karakter.',
            'title.unique' => 'Judul media sudah tersedia.',
            'type.required' => 'Jenis media wajib diisi.',
            'type.string' => 'Jenis media harus berupa teks.',
            'type.max' => 'Jenis media maksimal 100 karakter.',
        ];
    }
}
