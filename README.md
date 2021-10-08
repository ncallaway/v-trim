# v-trim

A tiny video trimming utility. `ffmpeg` required.

## Example Usage

`v-trim [input] --trim "5,16" --speed "[6,7]" .25 --speed "[10,11]" .4 --rm "[8,9]" [output]`

 `v-trim file.2020.mp4 --trim 5,16 --speed 6,7 .25 --speed 10,11 1.4 out.mp4`