import React, { Component } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export default class News extends Component {
        static defaultProps = {
            country: 'in',
            pageSize: 10,
            category: 'general'
        }

        static propTypes = {
            country: PropTypes.string,
            pageSize: PropTypes.number,
            category: PropTypes.string
        }
        capitalizeFirstLetter = (str) => {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        constructor(props){
            super(props);
            console.log("Hello I'm a constructor");
            this.state = {
                articles: [],
                loading: false,
                page: 1
            }
            document.title = `${this.capitalizeFirstLetter(this.props.category)} - NewsMonkey`;
;        }
        
        async updateNews() {
            console.log(this.state.page);
            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=eea62f0fdc704f66b890de73b0acfa28&page=${this.state.page}&pageSize=${this.props.pageSize}`;
            this.setState({loading: true})
            let data = await fetch(url);
            let parsedData = await data.json();
            console.log(parsedData)
            this.setState({
                articles: parsedData.articles,
                 totalResults: parsedData.totalResults,
                 loading: false
                })
        }
        async componentDidMount() {
            this.updateNews();
        }
        
        handlePrevClick = async () => {

            if(this.state.page<=1) return;
            await this.setState({page: this.state.page-1});
            // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=eea62f0fdc704f66b890de73b0acfa28&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
            // this.setState({loading: true})
            // let data = await fetch(url);
            // let parsedData = await data.json();
            // console.log(parsedData)
            // this.setState({
            //     articles: parsedData.articles,
            //     page: this.state.page-1,
            //     loading: false
            // })
            this.updateNews();

        }

        handleNextClick = async () => {
            console.log('next');

            if(this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize))return;

            await this.setState({ page: this.state.page + 1 });
            this.updateNews();
            
            // let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&$category={this.props.category}&apiKey=eea62f0fdc704f66b890de73b0acfa28&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
            // this.setState({loading: true})
            // let data = await fetch(url);
            // let parsedData = await data.json();
            // console.log(parsedData)
            // this.setState({
            //     articles: parsedData.articles,
            //     page: this.state.page+1,
            //     loading: false
            // })
        }
    render() {
        return (
            <div className="container my-3">
                <div className="text-center" style={{margin: '40px 0px'}}>
                    <h2>NewsMonkey - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>
                </div>
                {this.state.loading && <Spinner/>}
                <div className="row">
                {!this.state.loading && this.state.articles.map((element) => {
                    return <div className="col-md-4" key={element.url}>
                    <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage}
                    date={element.publishedAt} newsUrl={element.url} source={element.source.name}/>
                </div>
                })}  
                </div>
                <div className="container d-flex justify-content-between mt-6">
                    <button disabled={this.state.page<=1} type="button" onClick={this.handlePrevClick} className="btn btn-dark btn-sm">&larr; Previous</button>
                    <button disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" onClick={this.handleNextClick} className="btn btn-dark btn-sm">Next &rarr;</button>
                </div>
            </div>
        )
    }
}
