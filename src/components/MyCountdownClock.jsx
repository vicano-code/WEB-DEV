import React from 'react';
import $ from 'jquery';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faPlay, faPause, faRotate } from '@fortawesome/free-solid-svg-icons'

class MyCountdownClock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sessionLength: 25,
            breakLength: 5,
            minutesLeft: 25,
            secondsLeft: 0,
            timeLeft: "25:00",
            timerLabel: "Session",
            session: "off",
            reset: "off"
        }
        this.breakLengthIncrement = this.breakLengthIncrement.bind(this);
        this.breakLengthDecrement = this.breakLengthDecrement.bind(this);
        this.sessionLengthIncrement = this.sessionLengthIncrement.bind(this);
        this.sessionLengthDecrement = this.sessionLengthDecrement.bind(this);
        this.startStopCountDown = this.startStopCountDown.bind(this);
        this.reset = this.reset.bind(this);
    }
    componentDidMount() {
        $("#break-decrement").on("click", this.breakLengthDecrement);
        $("#break-increment").on("click", this.breakLengthIncrement);
        $("#session-decrement").on("click", this.sessionLengthDecrement);
        $("#session-increment").on("click", this.sessionLengthIncrement);
        $("#start-stop").on("click", this.startStopCountDown);
        $("#reset").on("click", this.reset);
    }

    breakLengthIncrement() {
        if(this.state.breakLength > 1){
            $("#session").css("color", "white");
        }
        if (this.state.session !== "on") {
            if (this.state.breakLength < 60) {
                this.setState({ breakLength: this.state.breakLength + 1 })
            }
        }
    }
    breakLengthDecrement() {
        if (this.state.session !== "on") {
            if (this.state.breakLength > 1) {
                this.setState({ breakLength: this.state.breakLength - 1 })
            }
        }
    }
    sessionLengthIncrement(state) {
        if(this.state.sessionLength > 0){
            $("#session").css("color", "white");
        }
        
        if (this.state.session !== "on") {
            if (this.state.sessionLength > 0 && this.state.sessionLength < 9) {
                this.setState({
                    sessionLength: this.state.sessionLength + 1,
                    minutesLeft: this.state.sessionLength + 1,
                    secondsLeft: 0,
                    timeLeft: "0" + (this.state.sessionLength + 1) + ":00"
                })
            }
            if (this.state.sessionLength >= 9 && this.state.sessionLength <= 59) {
                this.setState({
                    sessionLength: this.state.sessionLength + 1,
                    minutesLeft: this.state.sessionLength + 1,
                    secondsLeft: 0,
                    timeLeft: this.state.sessionLength + 1 + ":00"
                })
            }
        }
        
    }
    sessionLengthDecrement(state) {
        if (this.state.session !== "on") {
            if (this.state.sessionLength > 1 && this.state.sessionLength <= 10) {
                this.setState({
                    sessionLength: this.state.sessionLength - 1,
                    minutesLeft: this.state.sessionLength - 1,
                    secondsLeft: 0,
                    timeLeft: "0" + (this.state.sessionLength - 1) + ":00"
                })
            }
            if (this.state.sessionLength > 10) {
                this.setState({
                    sessionLength: this.state.sessionLength - 1,
                    minutesLeft: this.state.sessionLength - 1,
                    secondsLeft: 0,
                    timeLeft: this.state.sessionLength - 1 + ":00"
                })
            }
        }
    }

    startStopCountDown() {
        if (this.state.session == "off") {
            this.setState({ session: "on" })
        } else {
            this.setState({ session: "off" })
        }
        if (this.state.reset == "on") {
            this.setState({ reset: "off" })
        }

        // Update the count down every 1 second
        var minute = this.state.minutesLeft;
        var sec = this.state.secondsLeft;
        if (this.state.secondsLeft >= 0 && this.state.secondsLeft < 10) {
            sec = "0" + this.state.secondsLeft;
        } else {
            sec = this.state.secondsLeft;
        }

        var x = setInterval(() => {
            if (this.state.session == "off") {
                clearInterval(x);
                sec++; //ensures that the timer stops immeiately on pause
            }
            if (sec == 0) {
                minute--;
                sec = 60;
            }
            if (sec > 0) {
                sec--;
            }
            if (minute == 1 & sec==0 ) {
                $("#session").css("color", "#D32F2F");
            } else {
                $("#session").css("color", "white");
            }
            if (minute < 1) {
                $("#session").css("color", "#D32F2F");
            } else {
                $("#session").css("color", "white");
            }
            if (this.state.minutesLeft == 0 && this.state.secondsLeft == 0) {
                document.getElementById("beep").play();
                setTimeout(() => { document.getElementById("beep").pause() }, 3000);
                if (this.state.timerLabel == "Session") {
                    this.setState({ timerLabel: "Break" });
                    minute = this.state.breakLength;
                    sec = 0;
                } else {
                    this.setState({ timerLabel: "Session" });
                    minute = this.state.sessionLength;
                    sec = 0;
                }
            }

            if (minute >= 0 && minute < 10 && sec >= 10) {
                this.setState({ timeLeft: "0" + minute + ":" + sec });
            }
            if (minute >= 0 && minute < 10 && sec < 10) {
                this.setState({ timeLeft: "0" + minute + ":" + "0" + sec });
            }
            if (minute >= 10 && sec >= 10) {
                this.setState({ timeLeft: minute + ":" + sec });
            }
            //if reset is clicked during countdown
            if (this.state.reset == "on") {
                clearInterval(x);
                this.setState({
                    sessionLength: 25,
                    breakLength: 5,
                    minutesLeft: 25,
                    secondsLeft: 0,
                    timeLeft: "25:00",
                    session: "off",
                    timerLabel: "Session",
                    //reset: "off"
                });
                minute = this.state.minutesLeft;
                sec = this.state.secondsLeft;
                $("#session").css("color", "white");
                document.getElementById("beep").currentTime = 0;
            }

            this.setState({ minutesLeft: minute, secondsLeft: sec })

        }, 1000);
    }

    reset() {
        this.setState({
            sessionLength: 25,
            breakLength: 5,
            minutesLeft: 25,
            secondsLeft: 0,
            timeLeft: "25:00",
            session: "off",
            reset: "on",
            timerLabel: "Session",
        })
        $("#session").css("color", "white");
        var myAudio = document.getElementById("beep");
        myAudio.pause();
        myAudio.currentTime = 0;
    }


    render() {
        return (
            <div id="container">
                <span id="appName">25 + 5 Clock</span>
                <div id="BreakAndSessionDiv">
                    <div id="BreakLengthDiv">
                        <span id="break-label">Break Length</span>
                        <div className="arrows">
                            <FontAwesomeIcon icon={faArrowDown} className="arrow" id="break-decrement" />
                            <span className="number" id="break-length">{this.state.breakLength}</span>
                            <FontAwesomeIcon icon={faArrowUp} className="arrow" id="break-increment" />
                        </div>
                    </div>
                    <div id="SessionLengthDiv">
                        <span id="session-label">Session Length</span>
                        <div className="arrows">
                            <FontAwesomeIcon icon={faArrowDown} className="arrow" id="session-decrement" />
                            <span className="number" id="session-length">{this.state.sessionLength}</span>
                            <FontAwesomeIcon icon={faArrowUp} className="arrow" id="session-increment" />
                        </div>
                    </div>
                </div>
                <div id="session">
                    <span id="timer-label">{this.state.timerLabel}</span>
                    <span id="time-left">{this.state.timeLeft}</span>
                    <audio src="https://bigsoundbank.com/UPLOAD/mp3/0001.mp3" id="beep" />
                </div>
                <div id="controlDiv">
                    <div id="start-stop">
                        <FontAwesomeIcon icon={faPlay} />
                        <FontAwesomeIcon icon={faPause} />
                    </div>
                    <FontAwesomeIcon icon={faRotate} id="reset" />
                </div>
                <div>
                    <span id="authorText">Designed and Coded by</span> <br />
                    <span id="author">Victor Anokwuru</span>
                </div>
            </div>

        )
    }
}

export default MyCountdownClock;