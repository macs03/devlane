import type { SleepAnalysis } from '@/types/sleepAnalysis';
import type { SleepEntry } from '@/types/sleepEntry';
import { formatSleepDuration } from '@/utils/sleepDuration';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 1024;

export class SleepAnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SleepAnalysisError';
  }
}

function getApiKey(): string {
  const key = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
  if (!key?.trim()) {
    throw new SleepAnalysisError(
      'Missing Anthropic API key. Set EXPO_PUBLIC_ANTHROPIC_API_KEY in your environment.',
    );
  }
  return key.trim();
}

function buildEntriesPayload(entries: SleepEntry[]): string {
  const lines = entries.map((entry) => {
    const duration = formatSleepDuration(entry.startTime, entry.endTime);
    const notes = entry.notes ? ` | notes: ${entry.notes}` : '';
    return `- ${entry.date} ${entry.startTime}–${entry.endTime} (${duration})${notes}`;
  });
  return lines.join('\n');
}

function extractJsonObject(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start !== -1 && end > start) {
    return trimmed.slice(start, end + 1);
  }
  return trimmed;
}

function parseAnalysisResponse(text: string): SleepAnalysis {
  const jsonText = extractJsonObject(text);
  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new SleepAnalysisError('Could not parse analysis response from the API.');
  }

  const candidate = parsed as SleepAnalysis;
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof candidate.summary !== 'string' ||
    !Array.isArray(candidate.insights) ||
    !candidate.insights.every((item) => typeof item === 'string') ||
    typeof candidate.actionableTip !== 'string' ||
    candidate.actionableTip.trim().length === 0
  ) {
    throw new SleepAnalysisError('Analysis response did not match the expected shape.');
  }

  return {
    summary: candidate.summary,
    insights: candidate.insights,
    actionableTip: candidate.actionableTip.trim(),
  };
}

export async function analyzeSleepEntries(entries: SleepEntry[]): Promise<SleepAnalysis> {
  if (entries.length === 0) {
    throw new SleepAnalysisError('No sleep entries in the last week to analyze.');
  }

  const apiKey = getApiKey();
  const entriesBlock = buildEntriesPayload(entries);

  const body = {
    model: MODEL,
    max_tokens: MAX_TOKENS,
    messages: [
      {
        role: 'user',
        content: `You are helping a parent track their baby's sleep. Analyze the following sleep log entries from the most recent 7-day window. Respond with JSON only, no markdown, using this exact shape:
{"summary":"one short paragraph","insights":["bullet 1","bullet 2","bullet 3"],"actionableTip":"one concrete recommendation"}

Provide 2–4 practical insights about patterns, total sleep, naps vs night sleep, and anything notable from notes. Be supportive and concise.

For actionableTip: write one or two short sentences the parent can act on this week (bedtime routine, nap timing, consistency, etc.). Use an imperative or clear action verb. Be supportive; do not give medical diagnoses.

Sleep entries:
${entriesBlock}`,
      },
    ],
  };

  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    let detail = '';
    try {
      const errorBody = (await response.json()) as { error?: { message?: string } };
      detail = errorBody.error?.message ?? '';
    } catch {
      detail = await response.text();
    }
    const suffix = detail ? `: ${detail}` : '';
    throw new SleepAnalysisError(`Analysis request failed (${response.status})${suffix}`);
  }

  const data = (await response.json()) as {
    content?: { type: string; text?: string }[];
  };

  const textBlock = data.content?.find((block) => block.type === 'text' && block.text);
  if (!textBlock?.text) {
    throw new SleepAnalysisError('Analysis response was empty.');
  }

  return parseAnalysisResponse(textBlock.text);
}
