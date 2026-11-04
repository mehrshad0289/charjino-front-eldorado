#!/usr/bin/env python3
"""Session 16: decode the remaining 6 captures (dashboard Currency / TopUp /
CustomItem / Purchased / Sold + influencer-program) to full TSX snapshots."""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fig_reassemble import reassemble
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)  # ui ux/

JOBS = [
    ("Currency/www_eldorado_gg_dashboard_offers_Currency_1920w_390w_1536w_default.make", "dash-currency"),
    ("TopUp/www_eldorado_gg_dashboard_offers_TopUp_1920w_390w_1536w_default.make", "dash-topup"),
    ("CustomItem/www_eldorado_gg_dashboard_offers_CustomItem_1920w_390w_1536w_default.make", "dash-customitem"),
    ("Purchased orders/www_eldorado_gg_dashboard_orders_purchased_1920w_390w_1536w_default.make", "dash-purchased"),
    ("Sold orders/www_eldorado_gg_dashboard_orders_sold_1920w_390w_1536w_default.make", "dash-sold"),
    ("nfluencer-program/www_eldorado_gg_influencer-program_1920w_390w_1536w_default.make", "influencer"),
]

for rel, tag in JOBS:
    path = os.path.join(ROOT, rel)
    z = zipfile.ZipFile(path)
    reassemble(z.read("canvas.fig"), os.path.join(HERE, "snapshots"), tag)
print("done")
