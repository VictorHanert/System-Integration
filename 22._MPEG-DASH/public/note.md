CD in to videos folder
        Command:
        ffmpeg -i input.mp4 \
        -map 0:v -map 0:a -b:v:0 300k -s:v:0 426x240 -profile:v:0 baseline -b:a:0 64k \
        -map 0:v -map 0:a -b:v:1 700k -s:v:1 640x360 -profile:v:1 main     -b:a:1 96k \
        -map 0:v -map 0:a -b:v:2 1500k -s:v:2 1280x720 -profile:v:2 high   -b:a:2 128k \
        -f dash playlist.mpd

# Pros/Cons for MPEG-DASH:
Pros:
(+) Better user experience.

(+) Faster initial load time

(+) Highly scalable.

(+) Saves money for large video host providers.

Cons:
(-) Operationally complex.

(-) Additional storage costs.

(-) Additional encoding costs.
