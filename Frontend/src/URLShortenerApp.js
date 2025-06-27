import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, Typography, Box, Tabs, Tab, Card, CardContent, Chip, Stack, IconButton
} from '@mui/material';
import {
  ContentCopy as CopyIcon, CheckCircle as CheckIcon, OpenInNew as OpenIcon, AccessTime, Public, Mouse, LocationOn, InsertLink
} from '@mui/icons-material';
import { Logger } from './Logger';

const isValidUrl = (url) => {
  try { new URL(url); return true; } catch { return false; }
};

const generateShortcode = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};

const formatDate = (date) => new Date(date).toLocaleString();
const isExpired = (date) => new Date() > new Date(date);

export default function URLShortenerApp() {
  const [tab, setTab] = useState(0);
  const [urls, setUrls] = useState([]);
  const [formData, setFormData] = useState([createFormEntry()]);
  const [copied, setCopied] = useState('');

  function createFormEntry() {
    return { originalUrl: '', customShortcode: '', validityPeriod: 30, errors: {} };
  }

  useEffect(() => {
    const stored = localStorage.getItem('shortened_urls');
    if (stored) {
      const parsedUrls = JSON.parse(stored);
      setUrls(parsedUrls);
    }
    Logger.info('App loaded');
  }, []);

  useEffect(() => {
    if (urls.length > 0) {
      localStorage.setItem('shortened_urls', JSON.stringify(urls));
    }
  }, [urls]);

  const handleChange = (i, field, value) => {
    const updated = [...formData];
    updated[i][field] = value;
    setFormData(updated);
  };

  const validate = (entry) => {
    const errors = {};
    if (!entry.originalUrl.trim()) errors.originalUrl = 'Required';
    else if (!isValidUrl(entry.originalUrl)) errors.originalUrl = 'Invalid';

    if (entry.customShortcode) {
      if (!/^[a-zA-Z0-9]{3,12}$/.test(entry.customShortcode))
        errors.customShortcode = '3–12 alphanumerics';
      else if (urls.some(u => u.shortcode === entry.customShortcode))
        errors.customShortcode = 'Taken';
    }

    return errors;
  };

  const handleSubmit = () => {
    const newUrls = [];
    const updatedForms = formData.map((entry) => {
      const errors = validate(entry);
      if (Object.keys(errors).length > 0) return { ...entry, errors };

      let code = entry.customShortcode || generateShortcode();
      while (urls.some(u => u.shortcode === code)) {
        code = generateShortcode();
      }

      const now = new Date();
      const expires = new Date(now.getTime() + entry.validityPeriod * 60000);

      const newUrl = {
        id: Date.now() + Math.random(),
        originalUrl: entry.originalUrl,
        shortcode: code,
        shortUrl: `${window.location.origin}/${code}`,
        createdAt: now.toISOString(),
        expiresAt: expires.toISOString(),
        validityPeriod: entry.validityPeriod,
        clicks: 0,
        clickData: []
      };

      Logger.info('URL shortened', { shortcode: code });
      newUrls.push(newUrl);
      return createFormEntry();
    });

    setUrls(prevUrls => [...newUrls, ...prevUrls]);
    setFormData(updatedForms);
  };

  const handleCopy = async (text, code) => {
    await navigator.clipboard.writeText(text);
    setCopied(code);
    setTimeout(() => setCopied(''), 2000);
    Logger.info('Copied to clipboard', { shortcode: code });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <InsertLink color="primary" />
        <Typography variant="h5">URL Shortener</Typography>
      </Box>

      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Shortener" />
        <Tab label="Statistics" />
      </Tabs>

      {tab === 0 && (
        <Box>
          {formData.map((entry, i) => (
            <Box key={i} mb={2}>
              <TextField label="Original URL" fullWidth value={entry.originalUrl} error={!!entry.errors.originalUrl}
                helperText={entry.errors.originalUrl} onChange={e => handleChange(i, 'originalUrl', e.target.value)} sx={{ mb: 1 }} />
              <TextField label="Custom Shortcode" fullWidth value={entry.customShortcode} error={!!entry.errors.customShortcode}
                helperText={entry.errors.customShortcode} onChange={e => handleChange(i, 'customShortcode', e.target.value)} sx={{ mb: 1 }} />
              <TextField label="Validity (mins)" type="number" fullWidth value={entry.validityPeriod}
                onChange={e => handleChange(i, 'validityPeriod', parseInt(e.target.value) || 30)} />
            </Box>
          ))}
          {formData.length < 5 && (
            <Button onClick={() => setFormData([...formData, createFormEntry()])} sx={{ mr: 1 }}>+ Add URL</Button>
          )}
          <Button variant="contained" onClick={handleSubmit}>Shorten URLs</Button>
        </Box>
      )}

      {tab === 1 && urls.map(url => (
        <Card key={url.id} sx={{ mt: 3 }}>
          <CardContent>
            <Typography color="primary" variant="subtitle1">
              {url.shortUrl}
            </Typography>
            <Stack direction="row" spacing={1} mt={1}>
              <IconButton onClick={() => handleCopy(url.shortUrl, url.shortcode)}>
                {copied === url.shortcode ? <CheckIcon color="success" /> : <CopyIcon />}
              </IconButton>
              <IconButton onClick={() => window.open(url.originalUrl, '_blank')}><OpenIcon /></IconButton>
            </Stack>
            <Typography variant="body2" color="text.secondary">{url.originalUrl}</Typography>
            <Stack spacing={1} mt={1}>
              <Typography variant="caption"><AccessTime fontSize="small" /> Created: {formatDate(url.createdAt)}</Typography>
              <Typography variant="caption"><AccessTime fontSize="small" /> Expires: {formatDate(url.expiresAt)}</Typography>
              <Typography variant="caption"><Mouse fontSize="small" /> Clicks: {url.clicks}</Typography>
              {isExpired(url.expiresAt) && <Chip label="Expired" color="error" size="small" />}
            </Stack>
            {url.clickData.length > 0 && (
              <Box mt={2}>
                <Typography variant="subtitle2">Recent Clicks</Typography>
                {url.clickData.slice(-5).reverse().map((click, idx) => (
                  <Stack direction="row" spacing={2} key={idx}>
                    <span><AccessTime fontSize="small" /> {formatDate(click.timestamp)}</span>
                    <span><Public fontSize="small" /> {click.referrer}</span>
                    <span><LocationOn fontSize="small" /> {click.location}</span>
                  </Stack>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}
