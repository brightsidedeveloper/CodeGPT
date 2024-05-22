import express from 'express'
import fs from 'fs'
import simpleGit from 'simple-git'
import path from 'path'
import { fileURLToPath } from 'url'

const app = express()
const git = simpleGit()

// Get the current directory
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.json())

app.post('/push-code', async (req, res) => {
  const { code, filePath } = req.body
  if (!code || !filePath) {
    return res.status(400).send('Missing code or filePath in request body')
  }

  try {
    // Write the code to the specified file
    console.log(__dirname, filePath)
    const fullFilePath = path.join(__dirname, filePath)
    fs.writeFileSync(fullFilePath, code, 'utf8')

    // Add, commit, and push the file to GitHub
    await git.add(fullFilePath)
    await git.commit(`Update ${filePath}`)
    await git.push('origin', 'main') // Ensure 'main' is the correct branch

    res.send('File pushed to GitHub successfully!')
  } catch (error) {
    console.error('Failed to push file to GitHub:', error)
    res.status(500).send('Failed to push file to GitHub')
  }
})

const port = 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
