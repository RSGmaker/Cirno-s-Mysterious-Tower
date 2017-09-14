using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class Audio
    {
        protected AudioManager _AM;
        protected HTMLAudioElement _audio;
        protected bool _hasPlayed;
        public string ID { get; protected set; }
        protected List<HTMLAudioElement> _blast;
        public bool IsPlaying
        {
            get
            {
                return !(!_hasPlayed || _audio.Paused || _audio.CurrentTime == 0.0);
            }
            set
            {
                if (value)
                {
                    Play();
                }
                else
                {
                    Pause();
                }
            }
        }
        protected bool _loop;
        public bool Loop
        {
            get
            {
                //return _audio.Loop;
                return _loop;
            }
            set
            {
                //_audio.Loop = value;
                _loop = value;
                //_audio.Loop = value;
            }
        }
        public double CurrentTime
        {
            get
            {
                return _audio.CurrentTime;
            }
            set
            {
                _audio.CurrentTime = value;
            }
        }
        public double Volume
        {
            get
            {
                return _audio.Volume;
            }
            set
            {
                _audio.Volume = value;
            }
        }
        public bool Play()
        {
            if (!IsPlaying)
            {
                lasttime = CurrentTime;
                _audio.Play();
                _hasPlayed = true;
                return true;
            }
            return false;
        }
        public bool Pause()
        {
            if (IsPlaying)
            {
                _audio.Pause();
                return true;
            }
            return false;
        }
        public bool Stop()
        {
            if (IsPlaying)
            {
                _audio.Pause();
                _audio.CurrentTime = 0;
                return true;
            }
            return false;
        }
        public Action<Audio> OnPlay;
        public Action<Audio> OnStop;
        public Audio(HTMLAudioElement audio, string ID, AudioManager AudioManager)
        {
            _audio = audio;
            this.ID = ID;
            var self = this;
            _AM = AudioManager;
            //object A = (() => self._OnPlay);
            //Action A = new Action(() => self._OnPlay());

            _audio.OnPlay = new Action(() => self._OnPlay()).ToDynamic();
            _audio.OnPause = new Action(() => self._OnStop()).ToDynamic();
            //_audio.OnEnded = new Action(() => self._OnStop()).ToDynamic();
            _audio.OnEnded = new Action(() => self._OnEnd()).ToDynamic();
            _audio.OnTimeUpdate = new Action(() => self._OnUpdate()).ToDynamic();

            _blast = new List<HTMLAudioElement>();
            int maxvoices = 6;
            int voices = 1;
            while (voices < maxvoices)
            {
                _blast.Add((HTMLAudioElement)_audio.CloneNode());
                voices += 1;
            }
            /*_blast.Add((AudioElement)_audio.CloneNode());
            _blast.Add((AudioElement)_audio.CloneNode());
            _blast.Add((AudioElement)_audio.CloneNode());
            _blast.Add((AudioElement)_audio.CloneNode());*/
            /*_audio.OnPlay = "self._OnPlay()".ToDynamic();
            _audio.OnPause = "self._OnStop()".ToDynamic();
            _audio.OnEnded = "self._OnStop()".ToDynamic();*/
        }


        public void Blast(float volume = 1f)
        {
            if (!IsPlaying)
            {
                Volume = volume;
                Play();
            }
            else
            {
                //((AudioElement)_audio.CloneNode()).Play();
                int i = 0;
                while (i < _blast.Count)
                {
                    HTMLAudioElement A = _blast[i];
                    //if (A.Paused || A.CurrentTime<0.15f || A.Played.Length==0)
                    if (A.Paused || A.CurrentTime < 0.10f || A.Played.Length == 0)
                    {
                        if (A.Paused || A.CurrentTime == 0.0 || A.Played.Length == 0)
                        {
                            A.Volume = volume;
                            A.Play();
                            i = _blast.Count;
                        }
                    }
                    i++;
                }
            }
        }


        protected void _OnPlay()
        {
            _AM.OnPlay(this);
            if (OnPlay.ToDynamic())
                OnPlay(this);
        }
        protected void _OnStop()
        {
            _AM.OnStop(this);
            if (OnStop.ToDynamic())
                OnStop(this);
        }
        protected void _OnEnd()
        {
            /*if (_loop)
            {
                CurrentTime = 0;
                Play();
            }
            else*/
            {
                _OnStop();
            }
        }
        protected double lasttime = 0;
        protected void _OnUpdate()
        {
            if (_loop)
            {
                //if ((CurrentTime+0.35) >= _audio.Duration)
                if ((CurrentTime + ((CurrentTime - lasttime) * 0.8)) >= _audio.Duration)
                {
                    CurrentTime = 0;
                    Play();
                }
                lasttime = CurrentTime;
            }
        }
    }
}
