using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Bridge;
using Bridge.Html5;

namespace CirnoGame
{
    public class AudioManager
    {
        protected Dictionary<string, Audio> data;
        protected List<Audio> playing;
        public static string Directory = "";
        public static AudioManager __this;
        public static AudioManager _this
        {
            get
            {
                if (__this == null)
                    __this = new AudioManager();
                return __this;
            }
        }
        public static void Init()
        {
            if (__this == null)
                __this = new AudioManager();
        }
        protected AudioManager()
        {
            data = new Dictionary<string, Audio>();
            playing = new List<Audio>();
        }
        public Audio Get(string path)
        {
            path = Directory + path;
            if (data.ContainsKey(path))
            {
                return data[path];
            }
            else
            {
                HTMLAudioElement AE = new HTMLAudioElement(path);
                Audio A = new Audio(AE, path, this);
                data.Add(path, A);
                return A;
            }
        }
        public Audio Play(string path, bool loop = false)
        {
            Audio A = Get(path);
            A.Loop = loop;
            A.Play();
            return A;
        }
        public void Blast(string path, float volume = 1f)
        {
            Audio A = Get(path);
            A.Blast(volume);
        }
        public void Stop(string path)
        {
            Audio A = Get(path);
            A.Stop();
        }
        public void Pause(string path)
        {
            Audio A = Get(path);
            A.Pause();
        }
        public void OnPlay(Audio audio)
        {
            if (!playing.Contains(audio))
            {
                playing.Add(audio);
            }
        }
        public void OnStop(Audio audio)
        {
            if (playing.Contains(audio))
            {
                playing.Remove(audio);
            }
        }
        public void StopAllFromDirectory(string directory)
        {
            directory = Directory + directory;
            data.Values.ForEach(A => { if (A.ID.StartsWith(directory)) { A.Stop(); } });
        }
        public void StopAll()
        {
            data.Values.ForEach(A => { A.Stop(); });
        }
    }
}
