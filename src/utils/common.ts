import { type ParsedUrlQuery } from "querystring";
import { type RefObject } from "react";

export function capitalize(str: string): string {
  let capitalized = str[0]!.toUpperCase();

  for (let i = 1; i < str.length; i++) {
    if (str[i] === str[i]?.toUpperCase()) {
      // it means another word starts here, so add space before
      capitalized += ` ${str[i]?.toUpperCase()}`;
    } else {
      capitalized += str[i];
    }
  }

  return capitalized + ":";
}

export function moveLabelUP(ref: RefObject<HTMLElement>) {
  ref.current?.classList.remove("-translate-y-[50%]");
  ref.current?.classList.add("-translate-y-[140%]");
}

export function trimText(text: string, trimBy: number): string {
  if (text.length <= trimBy) return text;
  return text.substring(0, trimBy).trim() + "...";
}

export function getPaginationQueries(ctx: { query: ParsedUrlQuery }) {
  const page = parseInt((ctx.query.page as string) ?? 1);
  const take = parseInt((ctx.query.take as string) ?? 4);
  const sort = ((ctx.query.sort as string) ?? "desc") as "asc" | "desc";

  return { page, take, sort };
}

export function pause(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function getDaysArray(input: Date[]) {
  const [s, e] = input;
  const a: Date[] = [];

  for (let d = new Date(s!); d <= new Date(e!); d.setDate(d.getDate() + 1)) {
    a.push(new Date(d));
  }

  return a;
}
