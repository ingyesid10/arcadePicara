"""
JPG a PDF Converter
Convierte una o varias imágenes JPG en un único archivo PDF.
Requiere: pip install PyMuPDF
"""

import fitz  # PyMuPDF
import os
import argparse
import sys
import glob


EXTENSIONES_SOPORTADAS = (".jpg", ".jpeg", ".png", ".bmp", ".gif", ".tiff", ".webp")


def convert_jpg_to_pdf(imagenes: list[str], pdf_salida: str) -> str:
    """
    Convierte una lista de imágenes en un único PDF.

    Args:
        imagenes:   Lista de rutas de imágenes (en orden).
        pdf_salida: Ruta del PDF de salida.

    Returns:
        Ruta absoluta del PDF generado.
    """
    if not imagenes:
        raise ValueError("No se proporcionaron imágenes.")

    # Validar que todas las imágenes existen
    for img in imagenes:
        if not os.path.isfile(img):
            raise FileNotFoundError(f"No se encontró el archivo: {img}")
        if not img.lower().endswith(EXTENSIONES_SOPORTADAS):
            raise ValueError(f"Formato no soportado: {img}. Use {EXTENSIONES_SOPORTADAS}")

    os.makedirs(os.path.dirname(os.path.abspath(pdf_salida)), exist_ok=True)

    doc = fitz.open()  # PDF vacío

    print(f"Convirtiendo {len(imagenes)} imagen(es) a PDF...")

    for i, img_path in enumerate(imagenes, start=1):
        # Abrir imagen como documento de una página
        img_doc = fitz.open(img_path)
        pdf_bytes = img_doc.convert_to_pdf()
        img_doc.close()

        img_pdf = fitz.open("pdf", pdf_bytes)
        doc.insert_pdf(img_pdf)
        img_pdf.close()

        print(f"  [{i}/{len(imagenes)}] {os.path.basename(img_path)}")

    pdf_salida_abs = os.path.abspath(pdf_salida)
    doc.save(pdf_salida_abs)
    doc.close()

    print(f"\nListo. PDF guardado en: {pdf_salida_abs}")
    return pdf_salida_abs


def resolver_imagenes(entradas: list[str]) -> list[str]:
    """
    Expande rutas y patrones glob a una lista ordenada de archivos de imagen.
    """
    archivos = []
    for entrada in entradas:
        coincidencias = glob.glob(entrada)
        if coincidencias:
            archivos.extend(sorted(coincidencias))
        else:
            archivos.append(entrada)  # se validará luego
    return archivos


def main():
    parser = argparse.ArgumentParser(
        description="Convierte una o varias imágenes JPG/PNG en un único PDF.",
        formatter_class=argparse.RawTextHelpFormatter,
        epilog="""Ejemplos:
  # Una sola imagen
  python jpg_to_pdf.py foto.jpg

  # Varias imágenes (se insertan en orden)
  python jpg_to_pdf.py pag1.jpg pag2.jpg pag3.jpg

  # Todas las JPGs de una carpeta (usando patrón glob)
  python jpg_to_pdf.py "C:\\escaneos\\*.jpg" -o resultado.pdf
"""
    )
    parser.add_argument(
        "imagenes",
        nargs="+",
        help="Ruta(s) o patrón(es) glob de imágenes de entrada"
    )
    parser.add_argument(
        "-o", "--output",
        default=None,
        help="Nombre del PDF de salida (por defecto: mismo nombre que la primera imagen)"
    )

    args = parser.parse_args()

    imagenes = resolver_imagenes(args.imagenes)

    if args.output:
        pdf_salida = args.output
        if not pdf_salida.lower().endswith(".pdf"):
            pdf_salida += ".pdf"
    else:
        base = os.path.splitext(os.path.abspath(imagenes[0]))[0]
        pdf_salida = base + ".pdf"

    try:
        convert_jpg_to_pdf(imagenes, pdf_salida)
    except (FileNotFoundError, ValueError) as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error inesperado: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
