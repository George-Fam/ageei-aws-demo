#!/usr/bin/env python3
"""Upload built sponsorship PDFs to Directus sponsor_package collection."""

import os
import sys
from pathlib import Path

import requests

DIRECTUS_URL = os.environ.get("DIRECTUS_URL", "https://cms.ageei.org")
DIRECTUS_TOKEN = os.environ["DIRECTUS_TOKEN"]
REPO_DIR = Path(__file__).resolve().parents[1]
BUILD_DIR = REPO_DIR / "build"


def auth_headers():
    return {"Authorization": f"Bearer {DIRECTUS_TOKEN}"}


def upload_file(filepath):
    filepath = Path(filepath)
    mime = "application/pdf"
    with filepath.open("rb") as fh:
        resp = requests.post(
            f"{DIRECTUS_URL}/files",
            headers=auth_headers(),
            files={"file": (filepath.name, fh, mime)},
        )
    resp.raise_for_status()
    return resp.json()["data"]["id"]


def find_sponsor_package():
    resp = requests.get(
        f"{DIRECTUS_URL}/items/sponsor_package",
        headers=auth_headers(),
        params={"limit": 1},
    )
    resp.raise_for_status()
    return resp.json()["data"]


def update_sponsor_package(en_file_id, fr_file_id):
    headers = {**auth_headers(), "Content-Type": "application/json"}
    payload = {"en": en_file_id, "fr": fr_file_id}
    resp = requests.patch(
        f"{DIRECTUS_URL}/items/sponsor_package",
        headers=headers,
        json=payload,
    )
    resp.raise_for_status()
    print(f"  updated  en={en_file_id} fr={fr_file_id}")


def create_sponsor_package(en_file_id, fr_file_id):
    headers = {**auth_headers(), "Content-Type": "application/json"}
    payload = {"en": en_file_id, "fr": fr_file_id}
    resp = requests.post(
        f"{DIRECTUS_URL}/items/sponsor_package",
        headers=headers,
        json=payload,
    )
    resp.raise_for_status()
    print(f"  created #{resp.json()['data']['id']}")


def main():
    en_pdf = BUILD_DIR / "package-en.pdf"
    fr_pdf = BUILD_DIR / "package-fr.pdf"

    if not en_pdf.exists():
        print(f"ERROR: {en_pdf} not found", file=sys.stderr)
        sys.exit(1)
    if not fr_pdf.exists():
        print(f"ERROR: {fr_pdf} not found", file=sys.stderr)
        sys.exit(1)

    print(f"Uploading {en_pdf.name}...")
    en_id = upload_file(en_pdf)
    print(f"  → {en_id}")

    print(f"Uploading {fr_pdf.name}...")
    fr_id = upload_file(fr_pdf)
    print(f"  → {fr_id}")

    existing = find_sponsor_package()
    if existing:
        update_sponsor_package(en_id, fr_id)
    else:
        create_sponsor_package(en_id, fr_id)

    print("Done.")


if __name__ == "__main__":
    main()
