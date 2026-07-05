"""
PDF Restriction Remover
-----------------------
Removes permissions restrictions from bank statement PDFs
so you can search, copy and redact them in Adobe.

Renames each file as: originalname_pwd_rmvd.pdf
Saves unlocked files into an "unlocked" subfolder.
Your original files are never touched.

Requirements:
    pip install pypdf
"""

import os
import sys
from pathlib import Path

try:
    from pypdf import PdfReader, PdfWriter
except ImportError:
    print("\n ERROR: The 'pypdf' library is not installed.")
    print(" Please open Command Prompt and run:")
    print("     pip install pypdf")
    print("\nThen run this script again.\n")
    input("Press Enter to close...")
    sys.exit(1)


def remove_restrictions(input_path: Path, output_path: Path) -> bool:
    """Read a PDF and write it out without restrictions."""
    try:
        reader = PdfReader(str(input_path))
        writer = PdfWriter()

        # Copy all pages
        for page in reader.pages:
            writer.add_page(page)

        # Copy metadata if present
        if reader.metadata:
            writer.add_metadata(reader.metadata)

        with open(output_path, "wb") as out_file:
            writer.write(out_file)

        return True

    except Exception as e:
        print(f"   ✗ Could not process: {input_path.name}")
        print(f"     Reason: {e}")
        return False


def main():
    print("=" * 60)
    print("  PDF Restriction Remover")
    print("=" * 60)
    print()

    # Ask for folder
    print("Drag your PDF folder into this window and press Enter,")
    print("or type the full folder path below:")
    print()
    folder_input = input("  Folder path: ").strip().strip('"').strip("'")

    if not folder_input:
        print("\n No folder provided. Exiting.")
        input("Press Enter to close...")
        return

    folder = Path(folder_input)

    if not folder.exists() or not folder.is_dir():
        print(f"\n Could not find folder: {folder}")
        input("Press Enter to close...")
        return

    # Find all PDFs
    pdf_files = list(folder.glob("*.pdf"))

    if not pdf_files:
        print(f"\n No PDF files found in: {folder}")
        input("Press Enter to close...")
        return

    print(f"\n Found {len(pdf_files)} PDF file(s) to process.")
    print()

    # Create output folder
    output_folder = folder / "unlocked"
    output_folder.mkdir(exist_ok=True)
    print(f" Output folder: {output_folder}")
    print()

    # Process each file
    success_count = 0
    fail_count = 0

    for pdf_file in sorted(pdf_files):
        # Build new filename: originalname_pwd_rmvd.pdf
        new_name = pdf_file.stem + "_pwd_rmvd.pdf"
        output_path = output_folder / new_name

        print(f"  Processing: {pdf_file.name}")
        print(f"        → {new_name}")

        if remove_restrictions(pdf_file, output_path):
            print(f"        ✓ Done")
            success_count += 1
        else:
            fail_count += 1

        print()

    # Summary
    print("=" * 60)
    print(f"  Complete!  {success_count} succeeded  |  {fail_count} failed")
    print(f"  Unlocked files saved to: {output_folder}")
    print("=" * 60)
    print()
    print("Your original files were not touched.")
    print()
    input("Press Enter to close...")


if __name__ == "__main__":
    main()
