import classNames from "classnames";
import React, { useState } from "react";
import { cn } from "../../utils/cn";
import { PlaneIcon } from "../../assets/SeatPicker/planeImg";

interface SeatGroup {
  name: string;
  rows: number;
  cols: number;
}

interface SeatPickerProps {
  className?: String;
  seatGroups: SeatGroup[];
  BookedSeats: {
    row: string; //A,B,C,D,E
    col: number; //01,03,11,18
    seat_group: string; //first, economy, bussiness
  }[];
  SelectedSeats: { row: string; col: number; group_name: string }[];
  SetSelectedSeats: React.Dispatch<
    React.SetStateAction<{ row: string; col: number; group_name: string }[]>
  >;
}

export function Seat_Picker({
  className,
  seatGroups,
  BookedSeats,
  SelectedSeats,
  SetSelectedSeats,
}: SeatPickerProps) {
  const isSeatBooked = (
    row: string,
    col: number,
    group_name: string
  ): boolean => {
    return BookedSeats.some(
      (seat) =>
        seat.row === row && seat.col === col && seat.seat_group == group_name
    );
  };

  const isSeatSelected = (
    row: string,
    col: number,
    group_name: string
  ): boolean => {
    return SelectedSeats.some(
      (seat) =>
        seat.row === row && seat.col === col && seat.group_name === group_name
    );
  };

  const handleSeatClick = (row: string, col: number, group_name: string) => {
    const seatId = `${row}${col.toString().padStart(2, "0")}`;
    console.log("Clicked seat:", seatId);

    const seatIndex = SelectedSeats.findIndex(
      (seat) =>
        seat.row === row && seat.col === col && seat.group_name === group_name
    );

    if (seatIndex !== -1) {
      // If the seat is already selected, remove it from the selectedSeats array
      const newSelectedSeats = [...SelectedSeats];
      newSelectedSeats.splice(seatIndex, 1);
      SetSelectedSeats(newSelectedSeats);
    } else {
      // If the seat is not selected, add it to the selectedSeats array
      const newSelectedSeats = [...SelectedSeats, { row, col, group_name }];
      SetSelectedSeats(newSelectedSeats);
    }
  };

  return (
    <div className={cn("relative seat-picker h-full flex flex-col", className)}>
      {/* Container with airplane SVG and seats positioned inside */}
      <div className="relative flex-1 w-full overflow-hidden">
        {/* Airplane SVG positioned at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center max-h-full overflow-hidden">
          <PlaneIcon className="w-full h-auto max-h-full" />
        </div>

        {/* Seats positioned absolutely inside the airplane SVG cabin area */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-4 py-16"
          style={{
            top: "42%",
            left: "8%",
            right: "8%",
          }}
        >
          <div
            className="w-full h-full overflow-y-auto"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {seatGroups.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="w-full seat-group mb-4 flex flex-col items-center"
              >
                <div className="font-semibold text-base text-zinc-800 mb-2  px-3 py-1 rounded">
                  {group.name}
                </div>
                {[...Array(group.rows)].map((_, i) => (
                  <div
                    key={i}
                    className="w-full seat-row flex flex-row justify-between items-center mb-1.5"
                  >
                    <div className="flex-1 seat-group-left flex flex-row justify-end gap-1.5 pr-3">
                      {[...Array(Math.ceil(group.cols / 2))].map((_, j) => (
                        <div
                          key={j + 1}
                          className={cn(
                            "seat flex h-8 px-1 w-fit rounded text-xs text-neutral-200 items-center justify-center bg-zinc-500 hover:bg-zinc-600 cursor-pointer transition-all shadow-sm",
                            {
                              "bg-red-500 hover:bg-red-500 cursor-not-allowed":
                                isSeatBooked(
                                  String.fromCharCode(65 + i),
                                  j + 1,
                                  group.name
                                ),
                            },
                            {
                              "ring-2 ring-sky-400 ring-offset-1 bg-sky-500":
                                isSeatSelected(
                                  String.fromCharCode(65 + i),
                                  j + 1,
                                  group.name
                                ),
                            }
                          )}
                          onClick={() => {
                            if (
                              !isSeatBooked(
                                String.fromCharCode(65 + i),
                                j + 1,
                                group.name
                              )
                            ) {
                              handleSeatClick(
                                String.fromCharCode(65 + i),
                                j + 1,
                                group.name
                              );
                            }
                          }}
                        >
                          {j + 1}
                        </div>
                      ))}
                    </div>

                    <div className="text-center text-xs font-semibold text-zinc-800 bg-white/80 rounded px-1 w-6">
                      {String.fromCharCode(65 + i)}
                    </div>

                    <div className="flex-1 seat-group-right flex flex-row justify-start gap-1.5 pl-3">
                      {[...Array(Math.floor(group.cols / 2))].map((_, k) => (
                        <div
                          key={k + 1}
                          className={cn(
                            "seat flex h-8 w-fit px-1 rounded text-xs text-neutral-200 items-center justify-center bg-zinc-500 hover:bg-zinc-600 cursor-pointer transition-all shadow-sm",
                            {
                              "bg-red-500 hover:bg-red-500 cursor-not-allowed":
                                isSeatBooked(
                                  String.fromCharCode(65 + i),
                                  group.cols / 2 + k + 1,
                                  group.name
                                ),
                            },
                            {
                              "ring-2 ring-sky-400 ring-offset-1 bg-sky-500":
                                isSeatSelected(
                                  String.fromCharCode(65 + i),
                                  group.cols / 2 + k + 1,
                                  group.name
                                ),
                            }
                          )}
                          onClick={() => {
                            if (
                              !isSeatBooked(
                                String.fromCharCode(65 + i),
                                group.cols / 2 + k + 1,
                                group.name
                              )
                            ) {
                              handleSeatClick(
                                String.fromCharCode(65 + i),
                                Math.ceil(group.cols / 2) + k + 1,
                                group.name
                              );
                            }
                          }}
                        >
                          {Math.ceil(group.cols / 2) + k + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
