'use server'

import { $ } from 'execa'

export async function listDirectoryContents(
  directory: string = '.'
): Promise<{ stdout?: string; error?: string }> {
  try {
    // For security, it's generally better to avoid directly passing user input to shell commands.
    // However, for this specific case of `ls -la` on a given directory, if the directory is validated
    // or comes from a trusted source, it can be acceptable.
    // Here, we'll default to the current directory if none is provided.
    const { stdout, stderr } = await $`ls -la ${directory}`

    if (stderr) {
      // Consider logging stderr or handling it differently
      console.warn(`Stderr from ls -la ${directory}:`, stderr)
    }

    return { stdout }
  } catch (error: any) {
    console.error(`Error executing ls -la ${directory}:`, error)
    return { error: error.message || 'Failed to execute command' }
  }
}
