import Head from 'next/head';

export default function SeoHead() {
  return (
    <Head>
      <title>PDF旋转工具 - 免费在线旋转PDF文件</title>
      <meta
        name="description"
        content="免费在线旋转PDF文件。无需注册，完全在浏览器中处理，保护您的隐私。支持90度、180度、270度旋转。"
      />
      <meta
        name="keywords"
        content="PDF旋转,旋转PDF,在线PDF工具,PDF编辑器,PDF处理,免费PDF工具"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href="https://yourdomain.com/" />
      <meta property="og:title" content="PDF旋转工具 - 免费在线旋转PDF文件" />
      <meta
        property="og:description"
        content="免费在线旋转PDF文件。无需注册，完全在浏览器中处理，保护您的隐私。"
      />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://yourdomain.com/" />
      <meta
        property="og:image"
        content="https://yourdomain.com/images/og-image.jpg"
      />
      <meta name="twitter:card" content="summary_large_image" />
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "PDF旋转工具",
          "url": "https://yourdomain.com/",
          "description": "免费在线旋转PDF文件。无需注册，完全在浏览器中处理，保护您的隐私。",
          "applicationCategory": "UtilityApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })}
      </script>
    </Head>
  );
}