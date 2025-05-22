FROM python:3.11

# 🛠️ Dépendances système utiles pour diffusers et PIL
RUN apt-get update && apt-get install -y \
    git \
    curl \
    ffmpeg \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 📁 Dossier de l’app
WORKDIR /app

# 📦 Copie du code
COPY . /app

# 🐍 Mise à jour de pip + dépendances Python
COPY requirements.txt .
COPY constraints.txt .
RUN pip install --upgrade pip
RUN pip3 install --pre torch torchvision torchaudio --index-url https://download.pytorch.org/whl/nightly/cu128
RUN pip install --no-deps git+https://github.com/huggingface/diffusers@739d6ec7319641c38796dffcb745de8de6a80b44
RUN pip install -r requirements.txt --constraint constraints.txt

# (Optionnel) Téléchargement des modèles à la build (ou cache via volume partagé)
# RUN python -c "from diffusers import StableDiffusionControlNetPipeline, ControlNetModel; ControlNetModel.from_pretrained('controlnet-finetuned/checkpoint-500/controlnet'); StableDiffusionControlNetPipeline.from_pretrained('runwayml/stable-diffusion-v1-5')"

# 📡 Port exposé
EXPOSE 5000

# 🚀 Lancement de Flask
CMD ["python", "asset/app.py"]
