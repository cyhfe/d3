import { css } from "@emotion/react";
import { Midi } from "@tonejs/midi";
import { forwardRef, useEffect, useRef, useState } from "react";

interface NotesVizProps {
  data?: Midi | null;
  isPlaying?: boolean;
  notes: NoteJSON[];
  setNotes: React.Dispatch<React.SetStateAction<NoteJSON[]>>;
}

const NotesViz = forwardRef<SVGRectElement, NotesVizProps>(function NotesViz(
  props,
  ref
) {
  return (
    <>
      <svg
        css={css`
          display: block;
        `}
        viewBox="0 ,0, 400, 300"
        width={"100%"}
        height={"80%"}
        preserveAspectRatio="none"
      >
        <rect x={0} y={0} width={400} height={300} fill="#263238">
          {/* {notes.map((note) => {
            return (
              <Note
                key={note.name + note.time}
                note={note}
                setNotes={setNotes}
              />
            );
          })} */}
        </rect>
        <g ref={ref}></g>
      </svg>
    </>
  );
});

interface NoteJSON {
  time: number;
  midi: number;
  name: string;
  velocity: number;
  duration: number;
  ticks: number;
  durationTicks: number;
}

export default NotesViz;
