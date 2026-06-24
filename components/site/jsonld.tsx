/**
 * Inline a Schema.org JSON-LD blob into the page.
 *
 * Google's crawler picks it up from <script type="application/ld+json">.
 * We pre-escape `</script>` to defang any user content that might contain it
 * (defense-in-depth — the blob shapes we use don't currently let user
 * input near here, but Article.headline does come from blog post titles).
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/<\/script/gi, '<\\/script');
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
