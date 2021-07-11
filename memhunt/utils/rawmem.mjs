import {execSync} from 'child_process';
import {open, read} from 'fs';
export default (pid, rawStart, rawEnd) => {
  return new Promise((res, rej) => {
    // 4d674600000-4d674640000 rw-p 00000000 00:00 0
    const start = parseInt(`0x${rawStart}`, 16);
    const end = parseInt(`0x${rawEnd}`, 16);
    const length = end - start;
    const buffer = Buffer.alloc(length);
    open(`/proc/${pid}/mem`, 'r', (err, fd) => {
      read(fd, buffer, 0, length, start, (err, bytesRead, buffer) => {
        res(buffer);
      });
    });
  })
};
