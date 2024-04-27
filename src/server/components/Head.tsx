export const Head = ({ title }: { title: string }) => {
  return (
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="x-ua-compatible" content="ie=edge" />
      <title>{title}</title>
      <script src="https://unpkg.com/htmx.org@1.9.10"></script> {/* htmx */}
      <link rel="stylesheet" href={`/public/output.css`} /> {/* tailwind */}
    </head>
  );
};
