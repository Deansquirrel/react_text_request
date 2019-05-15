import React, {Component} from 'react';
import { LocaleProvider } from 'antd';
import { Row,Col,Input,Divider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import "antd/dist/antd.css";
import "./App.css"
import $ from 'jquery'

export default App;

function App(){
    return (
        <LocaleProvider locale={zhCN}>
            <div className={"rootContainer"}>
                <SearchContainer />
            </div>
        </LocaleProvider>
    )
}

class SearchContainer extends React.Component {
    constructor(props){
        super(props);
        this.state={
            errCode:"",
            errMsg:"",
            searchPhone:"",
            searchResult:{},
            showResult:false,
            disabled:false
        }
    }

    onSearch(value){
        this.setState({
            searchPhone:value
        });
        this.getJsonResult(value)
    }

    getJsonResult(searchPhone){
        $.ajax({
            url:"https://www.baidu.com",
            dataType:'json',
            cache:false,
            type:'POST',
            data:{},
            befordSend:function(){
                this.setState({
                    disabled:true
                })
            }.bind(this),
            complete:function(){
                console.log("complete")
                let r = {};
                r.searchPhone = searchPhone
                r.errCode = -1;
                r.errMsg = "testMsg";
                r.result = "failed";
                this.setState({
                    disabled:false,
                    searchResult:r,
                    showResult:true,
                })
            }.bind(this),
            success:function(data){
                console.log(data)
            }.bind(this),
            error:function(xhr,status,err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this)
        })
    }

    render(){
        return (
            <div className={"SearchContainer"}>
                <SearchForm
                    placeholder={"手机号"}
                    disabled={this.state.disable}
                    searchPhone={this.state.searchPhone}
                    onSearch={(value)=>this.onSearch(value)} />
                <ResultInfo
                    searchPhone={this.state.searchPhone}
                    result={this.state.searchResult}
                    showResult={this.state.showResult?"block":"none"} />
            </div>
        )
    }
}

const Search = Input.Search;

class SearchForm extends Component {
    onSearch(value){
        value = value.trim()
        if (value !== "") {
            console.log(value)
            this.props.onSearch(value)
        }
    }

    render(){
        return (
            <div>
                <Search
                    autoFocus
                    defaultValue={""}
                    disabled={this.props.disabled}
                    allowClear
                    placeholder={this.props.placeholder}
                    enterButton="Update"
                    size="large"
                    onSearch={(value) => {this.onSearch(value)}}
                />
            </div>
        )
    }
}

class ResultInfo extends Component {
    render(){
        return (
            <div className={"ResultInfo"} style={{display:this.props.showResult}}>
                <Divider />
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className={"ResultInfo_title"} span={8}>
                        SearchPhone
                    </Col>
                    <Col className={"ResultInfo_content"} span={16}>
                        {this.props.searchPhone}
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <Col className={"ResultInfo_title"} span={8}>
                        SearchResult
                    </Col>
                    <Col className={"ResultInfo_content"} span={16}>
                        {this.props.result.result}
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{display:this.props.result.errCode===0?"none":"block"}}>
                    <Col className={"ResultInfo_title"} span={8}>
                        errCode
                    </Col>
                    <Col className={"ResultInfo_content"} span={16}>
                        {this.props.result.errCode}
                    </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{display:this.props.result.errCode===0?"none":"block"}}>
                    <Col className={"ResultInfo_title"} span={8}>
                        errMsg
                    </Col>
                    <Col className={"ResultInfo_content"} span={16}>
                        {this.props.result.errMsg}
                    </Col>
                </Row>
            </div>
        )
    }
}