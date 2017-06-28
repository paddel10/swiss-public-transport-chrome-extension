#!/bin/bash

# batch
# cat zvv.txt | while read line; do sh createLabels.sh $line; done

TRANSPORT=$1
NUMBER=$2
COLOR=$3

convert -background "${COLOR}" -fill white  -font Helvetica -size 48x48  -pointsize 24  -gravity center label:${NUMBER} ${TRANSPORT}${NUMBER}.png
