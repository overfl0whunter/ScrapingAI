"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedCodeEditor } from "@/components/animated-code-editor"
import { Button } from "@/components/ui/button"
import { Download, Copy, Share2 } from "lucide-react"

// Sample code snippets
const samples = {
  python: `import requests
from bs4 import BeautifulSoup

def scrape_website(url):
    """Scrape a website and extract all links."""
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    links = []
    for link in soup.find_all('a'):
        href = link.get('href')
        if href:
            links.append(href)
    
    return links

# Example usage
if __name__ == "__main__":
    url = "https://example.com"
    links = scrape_website(url)
    print(f"Found {len(links)} links on {url}")
    for link in links[:5]:
        print(f"- {link}")`,

  javascript: `// Web scraper using Puppeteer
const puppeteer = require('puppeteer');

async function scrapeWebsite(url) {
  // Launch the browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Navigate to the URL
  await page.goto(url);
  
  // Extract all links
  const links = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('a'))
      .map(link => link.href);
  });
  
  // Close the browser
  await browser.close();
  
  return links;
}

// Example usage
(async () => {
  const url = 'https://example.com';
  const links = await scrapeWebsite(url);
  console.log(\`Found \${links.length} links on \${url}\`);
  links.slice(0, 5).forEach(link => console.log(\`- \${link}\`));
})();`,

  typescript: `// Web scraper with TypeScript and Axios
import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapeResult {
  links: string[];
  title: string | null;
}

async function scrapeWebsite(url: string): Promise<ScrapeResult> {
  try {
    // Fetch the HTML content
    const response = await axios.get(url);
    const html = response.data;
    
    // Load the HTML into cheerio
    const $ = cheerio.load(html);
    
    // Extract links and title
    const links = $('a')
      .map((_, element) => $(element).attr('href'))
      .get()
      .filter((href): href is string => href !== undefined);
    
    const title = $('title').text() || null;
    
    return { links, title };
  } catch (error) {
    console.error('Error scraping website:', error);
    return { links: [], title: null };
  }
}

// Example usage
(async () => {
  const url = 'https://example.com';
  const result = await scrapeWebsite(url);
  console.log(\`Found ${result.links.length} links on ${url}\`);
  console.log(\`Page title: ${result.title}\`);
})();`,
}

export function CodeSamples() {
  const [activeTab, setActiveTab] = useState("python")

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="p-4 bg-muted/40 border-b flex justify-between items-center">
        <h3 className="font-medium">Code Samples</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Copy className="h-3.5 w-3.5" />
            <span>Copy</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Download</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 pt-4">
          <TabsList className="grid grid-cols-3 w-[300px]">
            <TabsTrigger value="python">Python</TabsTrigger>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="typescript">TypeScript</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="python" className="m-0">
          <AnimatedCodeEditor code={samples.python} language="python" title="Web Scraper - Python" readOnly />
        </TabsContent>

        <TabsContent value="javascript" className="m-0">
          <AnimatedCodeEditor
            code={samples.javascript}
            language="javascript"
            title="Web Scraper - JavaScript"
            readOnly
          />
        </TabsContent>

        <TabsContent value="typescript" className="m-0">
          <AnimatedCodeEditor
            code={samples.typescript}
            language="typescript"
            title="Web Scraper - TypeScript"
            readOnly
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
