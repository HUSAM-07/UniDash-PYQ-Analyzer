2. Data Processing
Verify your exam_questions.txt is in the api/data/ directory
Run the preprocessing script:
bash
python preprocess.py
3. Model Training
Run the training script:
bash
python train.py
Monitor the training process through:
Loss values in the terminal
Training logs in the logs directory
Model checkpoints in the model/checkpoints directory
4. Model Serving
After training completes, start the Flask server:
bash
python app.py
Important Monitoring Points
Watch memory usage during training
Check the logs directory for training progress
Verify model checkpoints are being saved
Ensure the Flask server starts without errors
If you encounter memory issues:
Reduce batch size in train.py
Increase gradient accumulation steps
Monitor system resources
Restart training if needed
Remember to keep the Flask server running while using the frontend application to make predictions.