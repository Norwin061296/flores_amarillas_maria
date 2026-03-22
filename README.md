# Flores amarillas — María

Proyecto especial en **React Native + Expo** con salida **web** (sitio estático / SPA) para celebrar a María con flores amarillas, animaciones y un ramo interactivo.

## Desarrollo

```bash
npm install
npm run web
```

También puedes usar `npm start` y elegir la plataforma en la terminal de Expo.

## Build para producción (Render u otro hosting estático)

```bash
npm run build:web
```

Se genera la carpeta `dist/` con `index.html`, assets y el bundle JS.

## Despliegue en Render

1. Crea un **Static Site** y conecta este repositorio.
2. **Build command:** `npm run render-build` (Render no permite `&&` en ese campo; el script hace install + export en `package.json`)
3. **Publish directory:** `dist`

Opcional: en la raíz está `render.yaml` como referencia para configuración como código.

## Personalizar

- **Foto principal del héroe:** `components/Hero.tsx` (`require('../assets/photos/XX.png')`).
- **Textos y mensajes del ramo:** `components/StorySection.tsx` y `components/InteractiveBouquet.tsx`.
- **Galería:** añade o quita entradas en `constants/gallery.ts` y archivos en `assets/photos/`.
