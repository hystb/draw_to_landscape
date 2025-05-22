
# 🎨 Draw to Landscape

## 🧠 Project Description

This project is a proof of concept for a web application that transforms **simple sketches into realistic landscapes** using a ControlNet-based generative AI model. Users can draw a Paint-like sketch, which is then processed through a diffusion pipeline to generate a rich, photorealistic image.

---

## 🚀 Features

- Intuitive web interface for sketching or uploading an image
- Automatic landscape generation from the sketch
- ControlNet support with Stable Diffusion backend
- Fully containerized with Docker for easy deployment

---

## 🧱 Project Structure

```
draw_to_landscape/
├── asset/
│   ├── app.py                  # Flask backend
│   ├── controlnet_utils.py     # Model loading and image processing
│   ├── static/                 # Static assets (CSS, JS, images)
│   ├── templates/              # HTML UI
├── Dockerfile                 # Docker image
├── docker-compose.yml         # Container orchestration
├── Makefile                   # Automation commands
├── requirements.txt           # Python dependencies
├── constraints.txt            # Package version constraints
```

---

## 🛠️ Installation

### 📦 Requirements

- Python 3.11
- Docker and Docker Compose
- GPU access is highly recommended for fast inference

### 🔧 Launch with Docker

```bash
git clone https://github.com/hystb/draw_to_landscape.git
cd draw_to_landscape
docker-compose up --build
```

Then open your browser at [http://localhost:5000](http://localhost:5000)

---

## 🧠 Technical Notes

- Uses **ControlNet with Stable Diffusion** for image generation
- `controlnet_utils.py` loads pre-trained weights and handles image processing
- Auto-trigger is managed via frontend JavaScript
- Future improvements: generation history, prompt conditioning, multiple styles

---

## 🧠 Fine-tuning Details

To customize the ControlNet model for sketch-to-landscape generation, a fine-tuning process was performed using the Hugging Face `diffusers` library. The training used a dataset of paired sketch and landscape images where each sample includes:
- a sketch (`conditioning_image`)
- the target landscape image (`image`)
- and a descriptive prompt (`caption`)

The fine-tuning was conducted with the following command:

```bash
accelerate launch diffusers/examples/controlnet/train_controlnet.py \
  --pretrained_model_name_or_path=runwayml/stable-diffusion-v1-5 \
  --controlnet_model_name_or_path=lllyasviel/sd-controlnet-scribble \
  --train_data_dir="hystb/mon-dataset-sketch-paysage" \
  --image_column=image \
  --conditioning_image_column=conditioning_image \
  --caption_column=caption \
  --resolution=768,384 \
  --center_crop=False \
  --train_batch_size=2 \
  --num_train_epochs=30 \
  --output_dir=controlnet-finetuned \
  --learning_rate=1e-5 \
  --checkpointing_steps=400 \
  --validation_image=dataset/inputs/sketch_00000234_(6).jpg.jpg \
  --validation_prompt="a beautifull landscape" \
  --seed=42
```

This setup uses `runwayml/stable-diffusion-v1-5` as the base model and `lllyasviel/sd-controlnet-scribble` as the ControlNet backbone, allowing the model to learn to condition its generations on sketch inputs. The resolution was set to `768x384` to match the dataset proportions, and the training was run for 30 epochs with regular checkpointing and validation.

The result is a ControlNet model fine-tuned specifically to generate realistic landscapes from sketches.

---

## 🚧 Possible Upgrades

To further enhance the visual quality of the generated images, a super-resolution module can be integrated into the pipeline. After the initial landscape generation, the output image could be passed through a pre-trained model such as **SwinIR** or **Real-ESRGAN** to upscale it to **Full HD (1920×1080)** while preserving fine details and textures.

This would allow the application to produce high-resolution results suitable for printing, desktop wallpapers, or high-quality concept art.

Example integration steps:
- Add a post-processing step after ControlNet generation.
- Use the [SwinIR](https://github.com/JingyunLiang/SwinIR) or [Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN) inference model.
- Optionally provide a toggle in the UI for “HD Mode”.

✨ This addition could significantly improve the visual fidelity and usability of the generated content.
