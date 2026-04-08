"""
PDF a JPG Converter
Convierte cada página de un PDF en una imagen JPG.
Requiere: pip install PyMuPDF
"""

import fitz  # PyMuPDF
import os
import argparse
import sys


def convert_pdf_to_jpg(pdf_path: str, output_dir: str = None, dpi: int = 150) -> list[str]:
    """
    Convierte cada página de un PDF a JPG.

    Args:
        pdf_path:   Ruta al archivo PDF.
        output_dir: Carpeta de salida. Si es None, se usa la misma carpeta del PDF.
        dpi:        Resolución de salida (por defecto 150).

    Returns:
        Lista de rutas de las imágenes generadas.
    """
    if not os.path.isfile(pdf_path):
        raise FileNotFoundError(f"No se encontró el archivo: {pdf_path}")

    if not pdf_path.lower().endswith(".pdf"):
        raise ValueError("El archivo debe tener extensión .pdf")

    if output_dir is None:
        output_dir = os.path.dirname(os.path.abspath(pdf_path))

    os.makedirs(output_dir, exist_ok=True)

    base_name = os.path.splitext(os.path.basename(pdf_path))[0]
    zoom = dpi / 72  # 72 es el DPI base de PDF
    matrix = fitz.Matrix(zoom, zoom)

    doc = fitz.open(pdf_path)
    total = len(doc)
    generated = []

    print(f"Convirtiendo '{os.path.basename(pdf_path)}' ({total} página(s)) a {dpi} DPI...")

    for i, page in enumerate(doc, start=1):
        pixmap = page.get_pixmap(matrix=matrix)
        # Nombre: nombre_pdf_pagina_001.jpg
        out_file = os.path.join(output_dir, f"{base_name}_pagina_{i:03d}.jpg")
        pixmap.save(out_file, "jpg")
        generated.append(out_file)
        print(f"  [{i}/{total}] {os.path.basename(out_file)}")

    doc.close()
    print(f"\nListo. {total} imagen(es) guardadas en: {output_dir}")
    return generated


def main():
    parser = argparse.ArgumentParser(
        description="Convierte un PDF en imágenes JPG (una por página)."
    )
    parser.add_argument("pdf", help="Ruta al archivo PDF de entrada")
    parser.add_argument(
        "-o", "--output",
        default=None,
        help="Carpeta de salida (por defecto, la misma del PDF)"
    )
    parser.add_argument(
        "-d", "--dpi",
        type=int,
        default=150,
        help="Resolución en DPI (por defecto: 150)"
    )

    args = parser.parse_args()

    try:
        convert_pdf_to_jpg(args.pdf, args.output, args.dpi)
    except (FileNotFoundError, ValueError) as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error inesperado: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
