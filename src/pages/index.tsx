import { saveAs } from 'file-saver';
import Image from 'next/image';
import Link from 'next/link';
import { PDFDocument, degrees } from 'pdf-lib';
import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import FileDropzone from '../components/FileDropzone';
import RotationControls from '../components/RotationControls';
import SeoHead from '../components/SeoHead';
import { useAppState } from '../contexts/globalContexts';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const { state, dispatch } = useAppState();

  const handleFileLoad = (file: File) => {
    setFile(file);
  };

  const handleReset = () => {
    setFile(null);
  };

  const handleDownLoad = async () => {
    if (!file || !state.pages) return;

    dispatch({ type: 'SET_PROCESSING', payload: true });

    try {
      // 1. 加载原始PDF文件
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      // 2. 应用每个页面的旋转
      pages.forEach((page, index) => {
        const pageRotation = state.pages[index]?.rotation || 0;
        page.setRotation(degrees(pageRotation));
      });

      // 3. 保存并生成新文件
      const rotatedPdfBytes = await pdfDoc.save();
      const blob = new Blob([rotatedPdfBytes], { type: 'application/pdf' });

      // 4. 生成新文件名（避免重复覆盖）
      const originalName = file.name.replace(/\.pdf$/i, '');
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      saveAs(blob, `${originalName}_rotated_${timestamp}.pdf`);
    } catch (error) {
      console.error('Error rotating PDF:', error);
    } finally {
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  };

  return (
    <>
      <SeoHead />
      <div className="sc-ed3929b0-0 XmxAe">
        <div className="sc-ed3929b0-1 dcgFNV">
          <div className="sc-ed3929b0-2 dZjwuV">
            <Link href="/" className="sc-ed3929b0-3 ciXssn">
              <svg
                viewBox="0 0 64 36"
                xmlns="http://www.w3.org/2000/svg"
                className="sc-49c604f9-1 WQCZw"
              >
                <path
                  fill="black"
                  d="M41.3111 0H37.6444C30.3111 0 24.6889 4.15556 21.7556 9.28889C18.8222 3.91111 12.9556 0 5.86667 0H2.2C0.977781 0 0 0.977779 0 2.2V5.86667C0 16.1333 8.31111 24.2 18.3333 24.2H19.8V33C19.8 34.2222 20.7778 35.2 22 35.2C23.2222 35.2 24.2 34.2222 24.2 33V24.2H25.6667C35.6889 24.2 44 16.1333 44 5.86667V2.2C43.5111 0.977779 42.5333 0 41.3111 0ZM19.3111 19.5556H17.8444C10.2667 19.5556 4.15556 13.4444 4.15556 5.86667V4.4H5.62222C13.2 4.4 19.3111 10.5111 19.3111 18.0889V19.5556ZM39.1111 5.86667C39.1111 13.4444 33 19.5556 25.4222 19.5556H23.9556V18.0889C23.9556 10.5111 30.0667 4.4 37.6444 4.4H39.1111V5.86667Z"
                  className="sc-49c604f9-0 btsKug"
                ></path>
              </svg>
              PDF.ai
            </Link>
          </div>
          <div className="sc-ed3929b0-2 dZjwuV">
            <div className="sc-ed3929b0-4 iyUQdl">
              <Link href="/" className="hover:underline">
                Pricing
              </Link>
              <Link href="/" className="hover:underline">
                Chrome extension
              </Link>
              <Link href="/" className="hover:underline">
                Use cases
              </Link>
              <Link href="/" className="hover:underline">
                API Hub
              </Link>
              <Link href="/" className="hover:underline">
                AI Agents
              </Link>
              <div
                className="language-switcher relative inline-block"
                translate="no"
              >
                <button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium">
                  <span>
                    <Image
                      src="https://hatscripts.github.io/circle-flags/flags/us.svg"
                      alt="English"
                      className="h-6 w-6 rounded-full"
                      width={24}
                      height={24}
                    />
                  </span>
                  <span className="font-medium">EN</span>
                </button>
              </div>
              <Link href="/" className="hover:underline">
                Get started →
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-[#f7f5ee] text-black">
        <div className="container mx-auto space-y-5 py-20">
          <div className="!mb-10 flex flex-col space-y-5 text-center">
            <h1 className="font-serif text-5xl">Rotate PDF Pages</h1>
            <p className="mx-auto mt-2 max-w-lg text-gray-600">
              Simply click on a page to rotate it. You can then download your
              modified PDF.
            </p>
          </div>

          <div className="selecto-ignore flex items-center justify-center space-x-3">
            {file && <RotationControls file={file} onReset={handleReset} />}
          </div>

          <div className="flex flex-wrap justify-center">
            <FileDropzone file={file} onFileLoad={handleFileLoad} />
          </div>

          <div className="selecto-ignore flex flex-col items-center justify-center space-y-3">
            {file && (
              <button
                className="sc-7ff41d46-0 aEnZv !w-auto shadow"
                onClick={() => handleDownLoad()}
                disabled={file ? false : true}
                aria-label="Zoom in"
                data-tooltip-id="Download-tooltip"
                data-tooltip-content="Split and download PDF"
              >
                <Tooltip id="Download-tooltip" />
                Download
              </button>
            )}
          </div>
        </div>
      </div>
      <footer className="bg-white">
        <h2 id="footer-heading" className="sr-only">
          Footer
        </h2>
        <div className="mx-auto mt-8 max-w-7xl border-t border-gray-900/10 px-6 pt-16 pb-8 sm:mt-12 lg:mt-16 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8">
              <Image
                className="h-7"
                src="/favicon.ico"
                alt="PDF.ai logo"
                width={28}
                height={28}
              />
              <div className="text-sm leading-6 text-gray-600">
                Chat with any PDF: ask questions, get summaries, find
                information, and more.
              </div>
              <div className="flex space-x-6">
                <a
                  href="/"
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                >
                  <span className="sr-only">TikTok</span>
                  <svg
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 2859 3333"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    className="h-6 w-6"
                    aria-hidden="true"
                    style={{ width: '20px' }}
                  >
                    <path d="M2081 0c55 473 319 755 778 785v532c-266 26-499-61-770-225v995c0 1264-1378 1659-1932 753-356-583-138-1606 1004-1647v561c-87 14-180 36-265 65-254 86-398 247-358 531 77 544 1075 705 992-358V1h551z"></path>
                  </svg>
                </a>
                <a
                  href="/"
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                >
                  <span className="sr-only">Instagram</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="/"
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                >
                  <span className="sr-only">Twitter</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="/"
                  className="text-gray-400 hover:text-gray-500"
                  target="_blank"
                >
                  <span className="sr-only">YouTube</span>
                  <svg
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="h-6 w-6"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
            <div className="mt-16 grid grid-cols-1 gap-8 xl:col-span-2 xl:mt-0">
              <div className="md:grid md:grid-cols-3 md:gap-8">
                <div>
                  <h3 className="text-sm leading-6 font-semibold text-gray-900">
                    Products
                  </h3>
                  <ul role="list" className="mt-6 list-none space-y-4 p-0">
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Use cases
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Chrome extension
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        API Hub
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        AI Agents
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Pricing
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Video tutorials
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Resources
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Blog
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        FAQ
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm leading-6 font-semibold text-gray-900">
                    We also built
                  </h3>
                  <ul role="list" className="mt-6 list-none space-y-4 p-0">
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Resume AI Scanner
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Invoice AI Scanner
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        AI Quiz Generator
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        QuickyAI
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Docsium
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        PDF GPTs
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        PDF AI generator
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Other PDF tools
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="mt-10 md:mt-0">
                  <h3 className="text-sm leading-6 font-semibold text-gray-900">
                    Company
                  </h3>
                  <ul role="list" className="mt-6 list-none space-y-4 p-0">
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        PDF.ai vs ChatPDF
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        PDF.ai vs Acrobat Reader
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Legal
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Affiliate program 💵
                      </a>
                    </li>
                    <li className="m-0 p-0">
                      <a
                        href="/"
                        className="text-sm leading-6 text-gray-600 hover:text-gray-900"
                      >
                        Investor
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
