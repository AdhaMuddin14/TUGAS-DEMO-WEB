<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $mediaId = $this->route('media');

        return [
            'title' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('media', 'title')->ignore($mediaId),
            ],

            'type' => [
                'sometimes',
                'required',
                'string',
                'max:100',
            ],

            'description' => [
                'sometimes',
                'nullable',
                'string',
            ],

            'cover' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Judul media wajib diisi.',
            'title.unique' => 'Judul media sudah digunakan.',
            'type.required' => 'Jenis media wajib diisi.',
        ];
    }
}
