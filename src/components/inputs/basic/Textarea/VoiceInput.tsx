import {Box} from "@mui/system";
import React, {
  TextareaHTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import {Controller, useForm} from "react-hook-form";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import GlobalCustomButton from "../../../buttons/CustomButton";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import styled from "styled-components";

const TextareaField = styled.textarea<any>`
  padding: 0.9rem;
  width: 100%;
  min-height: 8rem;
  font-size: 0.85rem;
  border: 1.5px solid
    ${({theme, errorText}) => (!errorText ? theme.grayTwo : "red")};
  width: 100%;
  resize: none;
  &:hover {
    border: 1px solid #000000;
  }
  &:focus {
    border: 2px solid #3779eb;
  }
  &:disabled {
    color: #000000;
  }
`;

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  errorText?: string;
  register?: any;
  placeholder?: string;
  sx?: string;
  control?: any;
  handleOnBlur?: any;
  onFocus?: any;
  required?: boolean;
  name?: string;
  value?: string;
  handleChange?: (value: string) => void;
}

const VoiceTextArea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  register,
  sx,
  control,
  handleOnBlur,
  onFocus,
  required = false,
  name,
  handleChange,
  value,
}) => {
  const [textContent, setTextContent] = useState("");
  const [lastTranscriptLength, setLastTranscriptLength] = useState(0);

  // Voice commands configuration
  const commands = [
    {
      command: ['full stop', 'period', 'dot'],
      callback: () => {
        setTextContent(prev => prev + '.');
      }
    },
    {
      command: ['comma'],
      callback: () => {
        setTextContent(prev => prev + ',');
      }
    },
    {
      command: ['question mark'],
      callback: () => {
        setTextContent(prev => prev + '?');
      }
    },
    {
      command: ['exclamation mark', 'exclamation point'],
      callback: () => {
        setTextContent(prev => prev + '!');
      }
    },
    {
      command: ['new paragraph'],
      callback: () => {
        setTextContent(prev => prev + '\n\n');
      }
    },
    {
      command: ['new line', 'line break'],
      callback: () => {
        setTextContent(prev => prev + '\n');
      }
    },
    {
      command: ['colon'],
      callback: () => {
        setTextContent(prev => prev + ':');
      }
    },
    {
      command: ['semicolon'],
      callback: () => {
        setTextContent(prev => prev + ';');
      }
    },
    {
      command: ['quote', 'quotation mark'],
      callback: () => {
        setTextContent(prev => prev + '"');
      }
    },
    {
      command: ['apostrophe'],
      callback: () => {
        setTextContent(prev => prev + "'");
      }
    },
    {
      command: ['dash', 'hyphen'],
      callback: () => {
        setTextContent(prev => prev + '-');
      }
    },
    {
      command: ['clear text', 'clear all'],
      callback: () => {
        setTextContent('');
        resetTranscript();
      }
    },
    {
      command: ['undo last', 'delete last'],
      callback: () => {
        setTextContent(prev => prev.slice(0, -1));
      }
    }
  ];

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({ commands });

  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Function to process punctuation in regular speech
  const processPunctuation = (text: string) => {
    return text
      .replace(/\b(full stop|period|dot)\b/gi, '.')
      .replace(/\bcomma\b/gi, ',')
      .replace(/\bquestion mark\b/gi, '?')
      .replace(/\b(exclamation mark|exclamation point)\b/gi, '!')
      .replace(/\bnew paragraph\b/gi, '\n\n')
      .replace(/\b(new line|line break)\b/gi, '\n')
      .replace(/\bcolon\b/gi, ':')
      .replace(/\bsemicolon\b/gi, ';')
      .replace(/\b(quote|quotation mark)\b/gi, '"')
      .replace(/\bapostrophe\b/gi, "'")
      .replace(/\b(dash|hyphen)\b/gi, '-');
  };

  const handleStartRecording = () => {
    SpeechRecognition.startListening({
      continuous: true,
      interimResults: true
    });
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleStopRecording = () => {
    SpeechRecognition.stopListening();
  };

  const handleClear = () => {
    setTextContent('');
    resetTranscript();
    setLastTranscriptLength(0);
  };

  // Handle transcript changes and combine with manual text
  useEffect(() => {
    if (transcript) {
      // Process only new content to avoid reprocessing
      const newContent = transcript.slice(lastTranscriptLength);
      if (newContent) {
        const processedNewContent = processPunctuation(newContent);
        setTextContent(prev => {
          // Remove the old transcript part and add the new processed content
          const withoutOldTranscript = prev.slice(0, prev.length - (transcript.length - lastTranscriptLength - newContent.length));
          return withoutOldTranscript + processedNewContent;
        });
        setLastTranscriptLength(transcript.length);
      }
    }
  }, [transcript, lastTranscriptLength]);

  // Update parent component when text content changes
  useEffect(() => {
    if (handleChange) {
      handleChange(textContent);
    }
  }, [textContent, handleChange]);

  // Reset transcript length when transcript is reset
  useEffect(() => {
    if (!transcript) {
      setLastTranscriptLength(0);
    }
  }, [transcript]);

  const handleManualChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setTextContent(newValue);
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Box>
        <Box sx={{ color: 'red', mb: 2 }}>
          Browser doesn't support speech recognition.
        </Box>
        <TextareaField
          value={textContent}
          onChange={handleManualChange}
          name={name}
          placeholder={placeholder}
          ref={inputRef}
        />
      </Box>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "30px",
          backgroundColor: "#fff",
          border: "1.5px solid #BBBBBB",
          borderBottom: "none",
          paddingRight: "5px",
        }}
      >
        <Box sx={{display: "flex"}}>
          <GlobalCustomButton
            variant="text"
            color="success"
            onClick={handleStartRecording}
            disabled={listening}
          >
            Start
          </GlobalCustomButton>
          <GlobalCustomButton
            variant="text"
            color="error"
            onClick={handleStopRecording}
            disabled={!listening}
          >
            Stop
          </GlobalCustomButton>
          <GlobalCustomButton
            variant="text"
            color="warning"
            onClick={handleClear}
          >
            Clear
          </GlobalCustomButton>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {listening && (
            <Box sx={{ 
              fontSize: '0.75rem', 
              color: 'green',
              animation: 'pulse 1s infinite'
            }}>
              Listening...
            </Box>
          )}
          {listening ? <MicIcon sx={{ color: 'green' }} /> : <MicOffIcon />}
        </Box>
      </Box>
      
      <Box>
        <TextareaField
          value={textContent}
          onChange={handleManualChange}
          name={name}
          placeholder={placeholder || "Start speaking or type here... Say 'full stop' for period, 'comma' for comma, 'new paragraph' for paragraph break."}
          ref={inputRef}
          onBlur={handleOnBlur}
          onFocus={onFocus}
        />
      </Box>

    
    </Box>
  );
};

export default VoiceTextArea;