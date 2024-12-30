import argparse
import os
import sys
import json
import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer

def load_model():
    try:
        print("Loading model...", file=sys.stderr)
        model_name = "google/flan-t5-base"
        tokenizer = T5Tokenizer.from_pretrained(model_name, local_files_only=False)
        model = T5ForConditionalGeneration.from_pretrained(model_name, local_files_only=False)
        print("Model loaded successfully!", file=sys.stderr)
        return model, tokenizer
    except Exception as e:
        print(f"Error loading model: {str(e)}", file=sys.stderr)
        sys.exit(1)

def calculate_similarity(question1, question2):
    """Calculate similarity between two questions using basic text comparison"""
    q1_words = set(question1.lower().split())
    q2_words = set(question2.lower().split())
    intersection = len(q1_words.intersection(q2_words))
    union = len(q1_words.union(q2_words))
    return intersection / union if union > 0 else 0

def generate_predictions(model, tokenizer, context, num_predictions=3):
    try:
        print("Generating predictions...", file=sys.stderr)
        prompt = (
            "Given these computer science exam questions as examples:\n"
            f"{context}\n\n"
            "Generate or Predict 3 New Questions that are being repeated, either in terms or importance. The questions should:\n"
            "1. Focus on complexity analysis and performance comparisons that frequently appear\n" 
            "2. Ask about trade-offs and improvements of algorithms that are commonly tested\n"
            "3. Cover computer science concepts that have high probability of being repeated\n"
            "Make questions detailed and specific, prioritizing topics that show up regularly.\n"
            "Generate questions:"
        )
        
        inputs = tokenizer(prompt, return_tensors="pt", max_length=512, truncation=True)
        
        # Optimized parameters for more focused generation
        outputs = model.generate(
            inputs.input_ids,
            max_length=128,
            num_return_sequences=5,  # Generate more to pick best 3
            num_beams=9,  # Divisible by num_beam_groups
            num_beam_groups=3,
            diversity_penalty=1.0,
            do_sample=False,
            no_repeat_ngram_size=4,
            length_penalty=1.0  # Encourage slightly longer responses
        )
        
        all_predictions = [
            tokenizer.decode(output, skip_special_tokens=True) 
            for output in outputs
        ]
        
        unique_predictions = []
        seen_questions = []
        
        for pred in all_predictions:
            pred = pred.strip()
            is_duplicate = False
            
            for seen_pred in seen_questions:
                similarity = calculate_similarity(pred, seen_pred)
                if similarity > 0.3:  # Similarity threshold
                    is_duplicate = True
                    break
            
            if not is_duplicate and len(pred.split()) > 5:
                unique_predictions.append(pred)
                seen_questions.append(pred)
                
                if len(unique_predictions) == num_predictions:
                    break
        
        print("Predictions generated successfully!", file=sys.stderr)
        return unique_predictions[:num_predictions]
        
    except Exception as e:
        print(f"Error generating predictions: {str(e)}", file=sys.stderr)
        sys.exit(1)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--data_dir', type=str, required=True)
    args = parser.parse_args()
    
    try:
        # Load processed data from JSON
        json_file = os.path.join(args.data_dir, 'processed_data.json')
        if not os.path.exists(json_file):
            print(f"Error: File not found: {json_file}", file=sys.stderr)
            sys.exit(1)
            
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not data:
            print("Error: Empty data file", file=sys.stderr)
            sys.exit(1)
        
        # Extract questions for context
        context = "\n".join(item["question"] for item in data if item["question"].strip())
        
        model, tokenizer = load_model()
        predictions = generate_predictions(model, tokenizer, context, num_predictions=3)
        
        # Print predictions one per line
        for pred in predictions:
            print(pred.strip())
            
        # After loading the JSON data
        print(f"Loaded {len(data)} questions from JSON", file=sys.stderr)
        print(f"First few questions:", file=sys.stderr)
        for item in data[:3]:
            print(f"- {item['question'][:100]}...", file=sys.stderr)
        
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main() 