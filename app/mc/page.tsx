'use client'

import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import SettingDrawer from '../components/mc/SettingDrawer';
import { LyricsContainer } from '../components/mc/LyricsContainer';
import { OptionContainer } from '../components/mc/OptionContainer';

export interface lyric {
  full: string;
  value: string;
  onset: string;
  final: string;
  tone: string;
}
export interface LyricArray extends Array<lyric> { };
const defaultLyrics: LyricArray = require('../data/lyrics.json')

export interface filterSettingInterface {
  onset: boolean[];
  final: {
    [key: string]: string[];
  };
}

const filterSetting: filterSettingInterface = require('../data/filterSetting.json')

export default function Home() {
  const [lyrics, setLyrics] = useState(defaultLyrics as LyricArray)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [wrongIndex, setWrongIndex] = useState([] as number[])
  const [mode, setMode] = useState('full' as string)
  const [currentFilter, setCurrentFilter] = useState(filterSetting as filterSettingInterface)
  const [filteredLyrics, setFilteredLyrics] = useState([] as LyricArray)

  const maxLyricHistoryCount = 9
  const handleOnEnter: () => void = () => {
    if (currentIndex < lyrics.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }
  const handleOnWrong: () => void = () => {
    if (wrongIndex.length > maxLyricHistoryCount) {
      wrongIndex.shift()
    }
    const newWrongIndex = [...wrongIndex, currentIndex]
    setWrongIndex(newWrongIndex)
  }

  const handleOnFilterChange: (e: any) => void = (e) => {
    const finalEntries = Object.entries(e.final)
    const selectedFinal = finalEntries.filter((entry: any) => {
      return entry[1] == true
    })
    const selectedFinalInObject = selectedFinal.reduce((acc, cur) => {
      const key = cur[0]
      return {
        ...acc,
        [key]: filterSetting.final[key]
      }
    }, {})
    const newFilter = {
      onset: filterSetting.onset,
      final: selectedFinalInObject
    }
    setCurrentFilter(newFilter as filterSettingInterface)

  }

  const handleonSongChange: (e: any) => void = (e) => {
    const lyrics: LyricArray = require(`../data/${e}.json`)
    setLyrics(lyrics)
  }



  useEffect(() => {
    setWrongIndex([])
    setMode('full')
    setCurrentFilter(filterSetting as filterSettingInterface)
    setCurrentIndex(0)
    const filteredLyrics = lyrics.filter((lyric: any) => {
      const value = lyric.value.trim()
      return value != ""
    })
    setFilteredLyrics(filteredLyrics)
  }, [lyrics])

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh" // This makes sure the Box takes up the full height of the viewport
      >
        <Container maxWidth='sm' style={{ textAlign: 'center' }}>
          <Box sx={{ mb: 2 }}>
            <SettingDrawer
              onResumeCallback={setCurrentIndex}
              onModeChangeCallback={setMode}
              currentIndex={currentIndex}
              currentMode={mode}
              maxIndex={filteredLyrics.length}
              onFilterChangeCallback={handleOnFilterChange}
              onSongChangeCallback={handleonSongChange}
            />
          </Box>

          <LyricsContainer mode={mode} lyrics={filteredLyrics} currentIndex={currentIndex} wrongIndex={wrongIndex} filter={currentFilter} />
          {
            filteredLyrics.length > 0 &&
            <OptionContainer answer={filteredLyrics[currentIndex].final} onAnswerClicked={handleOnEnter} onWrongClicked={handleOnWrong} />
          }
          <Typography variant="body1" component="div" gutterBottom>
            {currentIndex + 1 + "/" + filteredLyrics.length}
          </Typography>
        </Container>
      </Box>
    </>

  )
}



