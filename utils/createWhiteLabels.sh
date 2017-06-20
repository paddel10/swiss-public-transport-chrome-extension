#!/bin/bash

NUMBER=$1

convert -bordercolor black -border 1x1 -background "white" -fill black -font Helvetica -size 46x46  -pointsize 24  -gravity center label:${NUMBER} ${NUMBER}.png