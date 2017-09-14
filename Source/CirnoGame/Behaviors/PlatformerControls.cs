using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class PlatformerControls : EntityBehavior
    {
        PlatformerEntity _platformer;
        public float accel = 0.35f;
        //public float jumpSpeed = 18f;
        public float jumpSpeed = 2.25f;
        public float maxSpeed = 1.5f;
        public int maxAirJumps = 1;
        public int airJumps = 0;
        public float airjumppower = 0.815f;
        public PlatformerControls(PlatformerEntity entity) : base(entity)
        {
            _platformer = entity;
        }
        public override void Update()
        {
            bool[] controller = _platformer.Controller;
            if (controller[0] && _platformer.Hspeed > -maxSpeed)
            {
                _platformer.Hspeed = (float)Math.Max(_platformer.Hspeed - (accel + _platformer.friction), -maxSpeed);
            }
            if (controller[1] && _platformer.Hspeed < maxSpeed)
            {
                _platformer.Hspeed = (float)Math.Min(_platformer.Hspeed + (accel + _platformer.friction), maxSpeed);
            }
            var jumpbutton = 5;
            if (_platformer.onGround)
            {
                airJumps = 0;
            }
            if (_platformer.Vspeed >= 0 && _platformer.onGround)
            {
                //if (controller[jumpbutton] && _platformer.Ceiling == null)
                //if (controller[jumpbutton] && _platformer.onGround && _platformer.Ceiling == null)
                if (_platformer.Pressed(jumpbutton) && _platformer.onGround && _platformer.Ceiling == null)
                {
                    _platformer.Vspeed = -jumpSpeed;
                    entity.PlaySound("jump");
                    ///entity.PlaySound("jump");
                }
                /*else if (controller[3] && _platformer.Floor != null && _platformer.Floor.platform)
                {
                    //platformer.y = groundY + 2;
                    _platformer.onGround = false;
                    _platformer.Floor = null;
                    _platformer.y += 2;
                }*/
            }
            else if (airJumps < maxAirJumps && _platformer.Pressed(jumpbutton) && _platformer.Ceiling == null)
            {
                _platformer.Vspeed = -(jumpSpeed * airjumppower);
                airJumps++;
            }
            if (_platformer.Vspeed < 0 && !controller[jumpbutton])
            {
                _platformer.Vspeed += (_platformer.gravity * 2);
            }
            base.Update();
        }
    }
}
