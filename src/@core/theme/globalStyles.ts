// ** MUI Imports
import { Theme } from '@mui/material/styles'

// ** Type Imports
import { Settings } from 'src/@core/context/settingsContext'

const GlobalStyles = (theme: Theme, settings: Settings) => {
  // ** Vars
  const { skin } = settings

  const perfectScrollbarThumbBgColor = () => {
    if (skin === 'semi-dark' && theme.palette.mode === 'light') {
      return '#57596C !important'
    } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
      return '#BFBFD5 !important'
    } else if (theme.palette.mode === 'light') {
      return '#BFBFD5 !important'
    } else {
      return '#57596C !important'
    }
  }

  return {
    'body[style^="padding-right"] header::after, body[style^="padding-right"] footer::after': {
      content: '""',
      position: 'absolute' as const,
      left: '100%',
      top: 0,
      height: '100%',
      backgroundColor: theme.palette.background.paper,
      width: '30px'
    },
    '.demo-space-x > *': {
      marginTop: '1rem !important',
      marginRight: '1rem !important',
      'body[dir="rtl"] &': {
        marginRight: '0 !important',
        marginLeft: '1rem !important'
      }
    },
    '.demo-space-y > *:not(:last-of-type)': {
      marginBottom: '1rem'
    },
    '.MuiGrid-container.match-height .MuiCard-root': {
      height: '100%'
    },
    '.ps__rail-y': {
      zIndex: 1,
      right: '0 !important',
      left: 'auto !important',
      '&:hover, &:focus, &.ps--clicking': {
        backgroundColor: theme.palette.mode === 'light' ? '#F3F3F8 !important' : '#393B51 !important'
      },
      '& .ps__thumb-y': {
        right: '3px !important',
        left: 'auto !important',
        backgroundColor: theme.palette.mode === 'light' ? '#BFBFD5 !important' : '#57596C !important'
      },
      '.layout-vertical-nav &': {
        '& .ps__thumb-y': {
          width: 4,
          backgroundColor: perfectScrollbarThumbBgColor()
        },
        '&:hover, &:focus, &.ps--clicking': {
          backgroundColor: 'transparent !important',
          '& .ps__thumb-y': {
            width: 6
          }
        }
      }
    },

    '#nprogress': {
      pointerEvents: 'none',
      '& .bar': {
        left: 0,
        top: 0,
        height: 3,
        width: '100%',
        zIndex: 2000,
        position: 'fixed',
        backgroundColor: theme.palette.primary.main
      }
    },

    '.prioridaUrgente': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#730ec0',
      color: '#fff',
      width: '120px',
      height: '36px',
      borderRadius: '25px'
    },

    '.prioridaAlta': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#ff0000',
      color: '#fff',
      width: '120px',
      height: '36px',
      borderRadius: '25px'
    },

    '.prioridadMedia': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F7EF80',
      color: '#000',
      width: '120px',
      height: '36px',
      borderRadius: '25px'
    },

    '.prioridadBaja': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#66F766',
      color: '#000',
      width: '120px',
      height: '36px',
      borderRadius: '25px'
    },

    '.sinPrioridad': {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#A1A8A1',
      color: '#fff',
      width: '120px',
      height: '36px',
      borderRadius: '25px'
    },

    '.spinner': {
      transform: 'translateZ(0)',
      animationIterationCount: 'infinite',
      animationTimingFunction: 'linear',
      animationDuration: '.8s',
      animationName: 'spinner-loading'
    },

    '@keyframes spinner-loading': {
      '0%': {
        transform: 'rotate(0deg)'
      },
      to: {
        transform: ' rotate(-1turn)'
      }
    },

    a: {
      textDecoration: 'none',
      color: 'inherit'
    },

    '.rmdp-container': {
      height: '100% !important'
    },

    '.rmdp-container > div': {
      height: '100% !important'
    },

    '.rmdp-input': {
      borderRadius: '8px',
      height: '56px !important',
      width: '100% !important'
    }
  }
}

export default GlobalStyles
