# v-trim

A tiny video trimming utility. `ffmpeg` required.

This tool is designed for quickly turning short screen-recordings into video files that are more friendly for sharing. It currently:

* sets the codec to `H.265`
* sets the constant rate factory quite high (`30`)
* limits the output resolution to a max of `1000px` wide
* lowers the framerate to `20`

Finally, the tool also allows for small edits and changes of the input recording.

## Example Usage

`v-trim [input] --trim 5,16 --speed 6,7 .25 --speed 10,11 .4 --rm 8,9 [output]`

`v-trim file.2020.mp4 --trim 5,16 --speed 6,7 .25 --speed 10,11 1.4 out.mp4`

## Installation

`npm install -g v-trim`

## Options


| option    | alias | arguments                | example      | description                                                                      |
| --------- | ----- | ------------------------ | ------------ | -------------------------------------------------------------------------------- |
| `--trim`  | `-t`  | `[slice]`                | `-t 5,15`    | Remove everything before the start of the slice, and after the end of the slice. |
| `--rm`    |       | `[slice]`                | `-rm 8,10`   | Remove the slice from the result.                                                |
| `--speed` | `-s`  | `[slice] [scale-factor]` | `-s 10,12 2` | Increase (or decrease) the playback of the slice by the given scale-factor.      |

### Slice

All options take a `slice` which represents a range of the time in the input video. Slices are two times (the start time and the end time of the slice) separated by a comma. Either time (but not both!) can be ommitted, to indicate that the slice should run to the beginning or end of the file. Slices are automatically clamped to 0 and the end of the video.

Some example slices (of a hypothetical 30s video):

* `5,7` - a 2-second slice starting at 5s and ending at 7s
* `,8.25` - an 8.25-second slice, starting at 0s and ending at 8.25s
* `24,` - a 6-second slice, starting at 24s and ending at 30s
* `25,90` - a 5-second slice, starting at 25s and ending at 30s (clamped to the length of the video)
* `0,` - a slice of the entire video
* `,` - not a legal slice! To represent the entire video use: `0,`

### Example


The following breaks down an example command-line usage to trim and change the speed of a video. We'll assume that the file in question started out as a 30-second video file.

`v-trim fun-video.mp4 --trim 5, --speed 8,12 2 --rm 16,24 --speed 27,28 0.5 shorter-video.trimmed.mp4`

Here is the effect this command translates the input file into the output file:

* `00s - 05s` not included in the output (`--trim 5,` which is equivalent to `--rm 0,5`)
* `05s - 08s` included as normal (included by default, not affected by any operations)
* `08s - 12s` included at 2x speed (`--speed 8,12 2`; maybe this section is boring, but valueable enough to include in the recording)
* `12s - 16s` included as normal (included by default)
* `16s - 24s` not included in the output (`--rm 16,24`; maybe this section is _very_ boring)
* `24s - 27s` included as normal (included by default)
* `27s - 28s` included at 0.5x speed (`--speed 27,28 0.5`; maybe this section is very important)
* `28s - 30s` included as normal (included by default)
