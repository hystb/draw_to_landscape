from diffusers import StableDiffusionControlNetPipeline, ControlNetModel
import torch

from PIL import Image

controlnet = ControlNetModel.from_pretrained("hystb/Finetune_controlnet_draw_to_landscape")
pipe = StableDiffusionControlNetPipeline.from_pretrained(
    "runwayml/stable-diffusion-v1-5",
    controlnet=controlnet,
    safety_checker=None,
).to("cuda")

pipe.enable_attention_slicing()


def generate_image_from_pil(sketch: Image.Image, prompt: str):
    sketch = sketch.resize((768, 384)).convert("RGB")
    output = pipe(prompt, image=sketch, num_inference_steps=15).images[0]
    return output
