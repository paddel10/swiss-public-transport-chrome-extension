#!/bin/bash

COLOR=$1
NUMBER=$2
convert -background "${COLOR}" -fill white  -font Helvetica -size 48x48  -pointsize 24  -gravity center label:${NUMBER} T${NUMBER}.png

# convert -bordercolor black -border 1x1 -background "white" -fill black -font Helvetica -size 46x46  -pointsize 24  -gravity center label:S24 S24.png