#!/bin/bash

COLOR=$1
NUMBER=$2
convert -background "${COLOR}" -fill white  -font Helvetica -size 48x48  -pointsize 24  -gravity center label:${NUMBER} T${NUMBER}.png
