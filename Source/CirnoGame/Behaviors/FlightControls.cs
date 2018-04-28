using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CirnoGame
{
    public class FlightControls : EntityBehavior
    {
        public float accel = 0.35f;
        public float maxSpeed = 1.7f;
        PlatformerEntity _platformer;

        public FlightControls(PlatformerEntity entity) : base(entity)
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
            if (controller[2] && _platformer.Vspeed > -maxSpeed)
            {
                _platformer.Vspeed = (float)Math.Max(_platformer.Vspeed - (accel + _platformer.friction), -maxSpeed);
            }
            if (controller[3] && _platformer.Vspeed < maxSpeed)
            {
                _platformer.Vspeed = (float)Math.Min(_platformer.Vspeed + (accel + _platformer.friction), maxSpeed);
            }
            /*var jumpbutton = 5;
            if (_platformer.Vspeed >= 0 && _platformer.onGround)
            {
                if (_platformer.Pressed(jumpbutton) && _platformer.onGround && _platformer.Ceiling == null)
                {
                    _platformer.Vspeed = -jumpSpeed;
                    ///entity.PlaySound("jump");
                }
            }
            else if (airJumps < maxAirJumps && _platformer.Pressed(jumpbutton) && _platformer.Ceiling == null)
            {
                _platformer.Vspeed = -(jumpSpeed * airjumppower);
                airJumps++;
            }
            if (_platformer.Vspeed < 0 && !controller[jumpbutton])
            {
                _platformer.Vspeed += (_platformer.gravity * 2);
            }*/
            base.Update();
        }
    }
}
