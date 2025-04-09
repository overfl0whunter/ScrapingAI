"use client"

import { useState } from "react"
import { Header } from "@/components/ui/header"
import { AnimatedCodeEditor } from "@/components/animated-code-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Save, Play, Sparkles, ArrowLeft } from "lucide-react"
import Link from "next/link"

// Sample starter code
const starterCode = `import requests
from bs4 import BeautifulSoup
import pandas as pd

def scrape_product_data(url):
    """
    Scrape product information from a given URL.
    
    Args:
        url (str): The URL to scrape
        
    Returns:
        dict: Product information including name, price, and description
    """
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract product information
    product = {
        'name': soup.select_one('.product-title').text.strip(),
        'price': soup.select_one('.product-price').text.strip(),
        'description': soup.select_one('.product-description').text.strip(),
        'rating': soup.select_one('.product-rating').text.strip(),
        'reviews': []
    }
    
    # Extract reviews
    review_elements = soup.select('.review-item')
    for review in review_elements:
        product['reviews'].append({
            'author': review.select_one('.review-author').text.strip(),
            'date': review.select_one('.review-date').text.strip(),
            'text': review.select_one('.review-text').text.strip(),
            'rating': review.select_one('.review-rating').text.strip()
        })
    
    return product

def save_to_csv(products, filename='products.csv'):
    """Save scraped products to a CSV file"""
    df = pd.DataFrame(products)
    df.to_csv(filename, index=False)
    print(f"Data saved to {filename}")

# Example usage
if __name__ == "__main__":
    urls = [
        "https://example.com/product/1",
        "https://example.com/product/2",
        "https://example.com/product/3"
    ]
    
    products = []
    for url in urls:
        print(f"Scraping {url}...")
        product = scrape_product_data(url)
        products.append(product)
    
    save_to_csv(products)
    print(f"Scraped {len(products)} products successfully!")`

export default function NewProjectPage() {
  const [projectName, setProjectName] = useState("")
  const [projectDescription, setProjectDescription] = useState("")
  const [language, setLanguage] = useState("python")
  const [code, setCode] = useState(starterCode)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Create New Project</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Details</CardTitle>
                <CardDescription>Enter the basic information for your new project</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-name">Project Name</Label>
                  <Input
                    id="project-name"
                    placeholder="My Awesome Project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project-description">Description</Label>
                  <Textarea
                    id="project-description"
                    placeholder="A brief description of your project"
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Programming Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="typescript">TypeScript</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="csharp">C#</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  Save Project
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Assistant</CardTitle>
                <CardDescription>Get help from our AI to improve your code</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full gap-2">
                  <Sparkles className="h-4 w-4" />
                  Generate Code
                </Button>
                <Button variant="outline" className="w-full gap-2">
                  <Play className="h-4 w-4" />
                  Test Code
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Tabs defaultValue="editor">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="editor">Code Editor</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Play className="h-4 w-4 mr-2" />
                    Run
                  </Button>
                  <Button size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>

              <TabsContent value="editor" className="m-0">
                <AnimatedCodeEditor
                  code={code}
                  language={language}
                  title={projectName || "New Project"}
                  onCodeChange={setCode}
                  readOnly={false}
                  animationSpeed={10}
                />
              </TabsContent>

              <TabsContent value="preview" className="m-0">
                <Card>
                  <CardContent className="p-6 min-h-[600px] flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-lg font-medium mb-2">Preview not available</h3>
                      <p className="text-muted-foreground">Preview is not available for this language or code type.</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  )
}
